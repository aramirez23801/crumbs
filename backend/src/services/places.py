import httpx
from fastapi import HTTPException

from src.core.config import settings
from src.schemas.places import PlaceSearchResult, PlaceDetailsResponse


class PlacesService:
    async def search(self, q: str) -> list[PlaceSearchResult]:
        if not settings.google_places_api_key:
            raise HTTPException(status_code=503, detail="Google Places API not configured")

        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://maps.googleapis.com/maps/api/place/autocomplete/json",
                params={
                    "input": q,
                    "types": "establishment",
                    "key": settings.google_places_api_key,
                },
            )

        data = response.json()
        if data.get("status") not in ("OK", "ZERO_RESULTS"):
            raise HTTPException(status_code=502, detail="Google Places API error")

        return [
            PlaceSearchResult(
                place_id=p["place_id"],
                description=p["description"],
                main_text=p["structured_formatting"]["main_text"],
                secondary_text=p["structured_formatting"].get("secondary_text", ""),
            )
            for p in data.get("predictions", [])
        ]

    async def get_details(self, place_id: str) -> PlaceDetailsResponse:
        if not settings.google_places_api_key:
            raise HTTPException(status_code=503, detail="Google Places API not configured")

        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://maps.googleapis.com/maps/api/place/details/json",
                params={
                    "place_id": place_id,
                    "fields": "name,website,url,formatted_address,address_components,price_level,geometry,photos",
                    "key": settings.google_places_api_key,
                },
            )

        data = response.json()
        if data.get("status") != "OK":
            raise HTTPException(status_code=502, detail="Google Places API error")

        result = data["result"]
        components: dict[str, str] = {}
        for c in result.get("address_components", []):
            for t in c["types"]:
                components.setdefault(t, c["long_name"])

        price_map = {0: 1, 1: 1, 2: 2, 3: 3, 4: 4}
        price_level = result.get("price_level")

        photos = result.get("photos", [])
        photo_ref = photos[0]["photo_reference"] if photos else None
        photo_url = (
            f"https://maps.googleapis.com/maps/api/place/photo"
            f"?maxwidth=800&photoreference={photo_ref}&key={settings.google_places_api_key}"
        ) if photo_ref else None

        return PlaceDetailsResponse(
            place_id=place_id,
            name=result.get("name"),
            website_url=result.get("website"),
            google_maps_url=result.get("url"),
            country=components.get("country"),
            city=components.get("locality") or components.get("administrative_area_level_2"),
            area=(
                components.get("sublocality_level_1")
                or components.get("sublocality")
                or components.get("neighborhood")
                or components.get("administrative_area_level_3")
            ),
            price_range=price_map.get(price_level) if price_level is not None else None,
            photo_url=photo_url,
        )
