import sys
import json
import numpy as np
import pandas as pd
import warnings
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
from rapidfuzz import process

# Suppress warnings
warnings.filterwarnings("ignore")

# Read movie and rating data
movies = pd.read_csv("movies.csv")
ratings = pd.read_csv("ratings.csv", nrows=6753444)

# Ensure consistent data types for the merge key
movies["id"] = pd.to_numeric(movies["id"], errors="coerce")
ratings["movieId"] = pd.to_numeric(ratings["movieId"], errors="coerce")

# Drop rows with NaN in the merge keys after conversion
movies = movies.dropna(subset=["id"])
ratings = ratings.dropna(subset=["movieId"])

# Convert both to int
movies["id"] = movies["id"].astype(int)
ratings["movieId"] = ratings["movieId"].astype(int)

# Extract and clean movie year from title

# Updated
movies["year"] = movies["release_date"].str.extract(r"(\d{4})", expand=False)
movies["title"] = (
    movies["original_title"].str.replace(
        r"(\(\d{4}\))", "", regex=True).str.strip()
)

# Merge movies and ratings

df = pd.merge(
    ratings,
    movies[["id", "original_title"]],
    left_on="movieId",
    right_on="id",
    how="inner",
)

# df = pd.merge(
#     movies[["id", "original_title"]],
#     ratings,
#     left_on="id",
#     right_on="movieId",
#     how="inner",
# )

df = df.groupby(["movieId", "userId", "original_title"], as_index=False).agg(
    {"rating": "mean"}
)


col_to_drop = ["id", "genres", "timestamp", "release_date", "homepage"]
df = df.drop([col for col in col_to_drop if col in df.columns], axis=1)


movie_users = df.pivot(index="movieId", columns="userId",
                       values="rating").fillna(0)
matrix_movies_users = csr_matrix(movie_users.values)


# Create KNN model
knn = NearestNeighbors(metric="cosine", algorithm="brute",
                       n_neighbors=20, n_jobs=-1)
knn.fit(matrix_movies_users)


# Recommendation function to find the output even if there is a misspelling or letter case issue
def recommender(movie_name, data, model, n_recommendations):
    model.fit(data)
    idx = process.extractOne(movie_name, df["original_title"])[2]
    distances, indices = model.kneighbors(
        data[idx], n_neighbors=n_recommendations)

    recommendations = [df["original_title"][i] for i in indices[0] if i != idx]
    print(json.dumps(recommendations))


if len(sys.argv) > 1:
    name = sys.argv[1]
else:
    print("No movie name provided. Using default for testing.")
    name = "The Dark Knight"  # Default movie name for testing


# Call the recommender function
recommender(name, matrix_movies_users, knn, 5)


# print(df.head())  # Should show movie and rating data
# print(df.columns)  # Should list all column names
