import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

# Load model
model_name = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)
sentiment_pipeline = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

# Load datasets
train_df = pd.read_csv("twitter_training.csv")
val_df = pd.read_csv("twitter_validation.csv")

# Function to process sentiment in batches
def analyze_sentiment(texts, batch_size=16):
    results = []
    texts = [str(text) if pd.notna(text) else "" for text in texts]

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        batch_results = sentiment_pipeline(batch)
        results.extend(batch_results)

    return results

# Apply sentiment analysis
train_df["sentiment"] = analyze_sentiment(train_df["text"].tolist())
val_df["sentiment"] = analyze_sentiment(val_df["text"].tolist())

# Save results
train_df.to_csv("train_with_sentiment.csv", index=False)
val_df.to_csv("validation_with_sentiment.csv", index=False)

print("Sentiment analysis completed and saved!")
