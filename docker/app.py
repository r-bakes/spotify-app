import json
import pandas as pd
from joblib import load


def handler(event, context):

    print("***************** EVENT *******************")
    print(event)
    print("*******************************************")

    # Preflight check OPTIONS request.
    # Short circuit and send success.

    if event["requestContext"]["http"]["method"] == "OPTIONS":
        return {
            "headers": {
                "Content-Type": "applications/json",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "http://localhost:3000/SnapShot",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
            "statusCode": 200,
            "body": json.dumps(
                {"message": "preflight OPTIONS check acknowledged", "event": event}
            ),
        }

    # Predict genre and output recommendation ids.

    body = json.loads(event["body"])

    x = {key: [value] for key, value in body.items()}
    x = pd.DataFrame(x)

    # Genre Labeling

    model = load("predict_genre_model.pkl")
    classes = model.classes_
    predictions = model.predict_proba(x.loc[0:0])[0]
    genre_prediction = sorted(zip(predictions, classes))[-3:]

    # Recommendations prediction

    model = load("predict_recommendations_model.pkl")

    tracks = pd.read_csv("recommendations_tracks.tsv", sep="\t", index_col=0)

    distances, indices = model.kneighbors(x.loc[0:0])

    recommendations_prediction = list(
        zip(
            tracks.loc[indices[0][1:], "id"].reset_index(drop=True).to_list(),
            distances[0][1:],
        )
    )

    # Send response

    response = {
        "headers": {
            "Content-Type": "applications/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
        },
        "statusCode": 200,
        "body": json.dumps(
            {
                "message": "Genre prediction and recommendations models invoked.",
                "data": {
                    "genrePrediction": genre_prediction,
                    "recommendationsPrediction": recommendations_prediction,
                },
                "event": event,
            }
        ),
    }

    return response
