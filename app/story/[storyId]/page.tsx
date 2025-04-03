"use client";

import { useEffect, useState } from "react";

import { AudioPlayer } from "@/components/audio-player";
import { Container } from "@/components/container";

interface Speaker {
  id: number;
  content: string;
  audio_src: string;
  story_id: number;
  order: number;
}

interface GeneralStory {
  id: number;
  content: string;
  audio_src: string;
  story_id: number;
  order: number;
}

interface StoryData {
  speakerOne: Speaker[];
  speakerTwo: Speaker[];
  generalStory: GeneralStory[];
}

export default function StoryPage({ params }: { params: { storyId: string } }) {
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);

  useEffect(() => {
    const fetchStoryData = async () => {
      try {
        console.log("Fetching data for story ID:", params.storyId);

        // First check if story exists
        const storyRes = await fetch(`/api/story/${params.storyId}`);
        if (!storyRes.ok) {
          console.log("Story not found");
          setStoryData(null);
          return;
        }

        // Then fetch related data
        const [speakerOneRes, speakerTwoRes, generalStoryRes] =
          await Promise.all([
            fetch(`/api/speakerOne?story_id=${params.storyId}`),
            fetch(`/api/speakerTwo?story_id=${params.storyId}`),
            fetch(`/api/generalStory?story_id=${params.storyId}`),
          ]);

        // Type guard functions
        const isSpeakerArray = (data: unknown): data is Speaker[] =>
          Array.isArray(data) &&
          data.every(
            (item) =>
              typeof item === "object" &&
              item !== null &&
              "id" in item &&
              "content" in item &&
              "audio_src" in item &&
              "story_id" in item &&
              "order" in item
          );

        const isGeneralStoryArray = (data: unknown): data is GeneralStory[] =>
          Array.isArray(data) &&
          data.every(
            (item) =>
              typeof item === "object" &&
              item !== null &&
              "id" in item &&
              "content" in item &&
              "audio_src" in item &&
              "story_id" in item &&
              "order" in item
          );

        // Fetch and check each response
        const speakerOneDataRaw = await speakerOneRes.json();
        if (!isSpeakerArray(speakerOneDataRaw)) {
          console.error("Speaker one data format does not match expected type.");
          setStoryData(null);
          return;
        }
        const speakerOneData: Speaker[] = speakerOneDataRaw;

        const speakerTwoDataRaw = await speakerTwoRes.json();
        if (!isSpeakerArray(speakerTwoDataRaw)) {
          console.error("Speaker two data format does not match expected type.");
          setStoryData(null);
          return;
        }
        const speakerTwoData: Speaker[] = speakerTwoDataRaw;

        const generalStoryDataRaw = await generalStoryRes.json();
        if (!isGeneralStoryArray(generalStoryDataRaw)) {
          console.error(
            "General story data format does not match expected type."
          );
          setStoryData(null);
          return;
        }
        const generalStoryData: GeneralStory[] = generalStoryDataRaw;
        // Sort by order
        const speakerOne = speakerOneData.sort((a, b) => a.order - b.order);
        const speakerTwo = speakerTwoData.sort((a, b) => a.order - b.order);
        const generalStory = generalStoryData.sort((a, b) => a.order - b.order);

        console.log("Sorted data:", {
          speakerOne,
          speakerTwo,
          generalStory,
        });

        if (
          speakerOne.length === 0 &&
          speakerTwo.length === 0 &&
          generalStory.length === 0
        ) {
          console.log("No content found for story ID:", params.storyId);
          setStoryData(null);
        } else {
          setStoryData({ speakerOne, speakerTwo, generalStory });
        }
      } catch (error) {
        console.error("Error fetching story data:", error);
        setStoryData(null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchStoryData();
  }, [params.storyId]);

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      </Container>
    );
  }

  if (!storyData) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          Story not found
        </div>
      </Container>
    );
  }
  const handleAudioPlay = (audioId: number): void => {
    setPlayingAudio(audioId);
  };

  const handleAudioPause = () => {
    setPlayingAudio(null);
  };
  return (
    <Container>
      <div className="max-w-4xl mx-auto py-12 space-y-8">
        {storyData.generalStory.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-3">
              {item.audio_src && (
                <AudioPlayer
                  id={item.id}
                  audioSrc={item.audio_src}
                  isPlaying={playingAudio === item.id}
                  onPlay={handleAudioPlay}
                  onPause={handleAudioPause}
                />
              )}
              <p className="text-gray-800">{item.content}</p>
            </div>
          </div>
        ))}

        {storyData.speakerOne.map((item) => (
          <div key={item.id} className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              {item.audio_src && (
                <AudioPlayer
                  id={item.id}
                  audioSrc={item.audio_src}
                  isPlaying={playingAudio === item.id}
                  onPlay={handleAudioPlay}
                  onPause={handleAudioPause}
                  variant="blue"
                />
              )}
              <p className="text-gray-800">{item.content}</p>
            </div>
          </div>
        ))}

        {storyData.speakerTwo.map((item) => (
          <div key={item.id} className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              {item.audio_src && (
                <AudioPlayer
                  id={item.id}
                  audioSrc={item.audio_src}
                  isPlaying={playingAudio === item.id}
                  onPlay={handleAudioPlay}
                  onPause={handleAudioPause}
                  variant="green"
                />
              )}
              <p className="text-gray-800">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
