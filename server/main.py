import random
from typing import List

from fastapi import FastAPI, HTTPException, status
from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorCollection,
)
from pydantic import BaseModel
import csv, os
from typing import Optional

app = FastAPI()
llms_collection: AsyncIOMotorCollection = AsyncIOMotorClient(
    "mongodb://root:example@mongodb:27017"
)["plino"]["llms"]

# Use an absolute path that works in Docker
BASE_DIR = os.path.abspath(os.path.dirname(__file__))  # Get current script's directory
FILE_DIR = os.path.join(BASE_DIR, "..", "data")  # Move up and locate the 'data' directory

# Resolve any symbolic links or relative paths
FILE_DIR = os.path.realpath(FILE_DIR)


@app.get("/")
async def read_root():
    return {"Hello": "World"}

class LLMObj(BaseModel):
    company: str
    category: str
    release_date: str
    model_name: str
    num_million_parameters: str

@app.post("/llm", status_code=status.HTTP_201_CREATED, response_model=None)
async def create_llm(
    el: Optional[LLMObj] = None):

    if el:
        print("--> NOT NULL")
    else:
        print("--> NULL")

        #csv_path = "llms1.csv"

        file_path = os.path.join(FILE_DIR, "llms.csv")
        print(file_path)

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="CSV file not found")
        
        with open(file_path, newline='') as csvfile:
            reader = csv.reader(csvfile)
            spamreader = list(reader)
            headerreader = spamreader[0]
            chosen_row = random.choice(spamreader[1:])
            el = LLMObj(company=chosen_row[0], category=chosen_row[1], release_date=chosen_row[2], model_name=chosen_row[3], num_million_parameters=chosen_row[4])

    search_el = await llms_collection.find_one(
        {"company": el.company, "category": el.category, "release_date": el.release_date, "model_name": el.model_name, "num_million_parameters": el.num_million_parameters}
    )

    if not search_el:
        result =  await llms_collection.insert_one(el.__dict__)
        return str(result.inserted_id)
    else:
        return "Elemento duplicato - inserimento non effettuato"

class GetLLMsResponseBody(BaseModel):
    llms: List[LLMObj]

@app.get(
    "/llms",
    status_code=status.HTTP_200_OK,
    response_model=GetLLMsResponseBody,
)
async def get_llms() -> GetLLMsResponseBody:
    
    elems = []

    async for el in llms_collection.find():
        elems.append(LLMObj(company=el["company"], category=el["category"], release_date=el["release_date"], model_name=el["model_name"], num_million_parameters=el["num_million_parameters"]))

    return {'llms': elems}