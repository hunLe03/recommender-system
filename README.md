# CSC 108 Final Project: Recommender System

### Description

This movie recommendation system is a python-based recommendation system that works on KNN algorithm.
KNN or K-nearest neighbor algorithm is a supervised machine learning algorithm.
K-NN algorithm stores all the available data and classifies a new data point based on the similarity.
So, we used this approach in our project to get five nearest data points to the one that the user will enter as per the requirements.

## Collaborative filtering

It is a technique that can filter out items that a user might like on the basis of reactions by similar users.
It works by searching a large group of people and finding a smaller set of users with tastes similar to a particular user.
It looks at the items they like and combines them to create a ranked list of suggestions.

## KNN Algorithm

K Nearest Neighbour algorithm is a Supervised Learning Algorithm which is used for classification and regression.
It can be used for imputing missing values and resampling datasets.
It considers K Nearest data points to predict the class or continuous value for the new Datapoint.
Here, nearest neighbours are those data points that have minimum distance in feature space from our new data point.
And K is the number of such data points we consider in our implementation of the algorithm.
To find the nearest distance, we have used cosine Similarity technique.

### Cosine metric

Cosine metric is the cosine of the angle between two vectors and it is used as a distance evaluation metric between two points in the plane.
It operates entirely on the cosine principles where with the increase in distance the similarity of data points reduces.
