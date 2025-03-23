import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SentimentAnalysis() {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSentiment = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setSentiment(data.sentiment);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Sentiment Analysis
      </motion.h1>
      <Card className="w-full max-w-md p-6 bg-white shadow-xl rounded-lg">
        <CardContent>
          <Input
            type="text"
            placeholder="Enter text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <Button
            onClick={analyzeSentiment}
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Sentiment"}
          </Button>
          {sentiment && (
            <motion.div
              className="mt-4 text-lg font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Sentiment: {sentiment[0].label} (Confidence: {sentiment[0].score.toFixed(2)})
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
