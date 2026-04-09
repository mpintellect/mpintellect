#!/bin/bash

# Check if symbol provided
if [ -z "$1" ]; then
    echo "❌ Usage: ./make-video.sh SYMBOL"
    echo "   Example: ./make-video.sh EURUSD"
    echo "   Example: ./make-video.sh XAUUSD"
    exit 1
fi

SYMBOL=$1
echo "🎬 Creating MP4 video for $SYMBOL..."

# Find the frames folder (matches pattern: SYMBOL_frames_*)
FRAMES_DIR=$(ls -d ${SYMBOL}_frames_* 2>/dev/null | head -1)

if [ -z "$FRAMES_DIR" ]; then
    # Try to find ZIP file if folder doesn't exist
    ZIP_FILE=$(ls -t ${SYMBOL}_frames_*.zip 2>/dev/null | head -1)
    if [ -z "$ZIP_FILE" ]; then
        echo "❌ No frames found for $SYMBOL"
        echo "   Looking for folder: ${SYMBOL}_frames_*"
        echo "   Or ZIP file: ${SYMBOL}_frames_*.zip"
        exit 1
    fi
    echo "📦 Extracting $ZIP_FILE..."
    unzip -o "$ZIP_FILE"
    # Get the extracted folder name
    FRAMES_DIR=$(ls -d ${SYMBOL}_frames_* 2>/dev/null | head -1)
fi

echo "📁 Using folder: $FRAMES_DIR"

# Get FPS from metadata (default 10)
if [ -f "$FRAMES_DIR/metadata.json" ]; then
    FPS=$(cat "$FRAMES_DIR/metadata.json" | grep fps | head -1 | cut -d':' -f2 | tr -d ' ,')
    echo "🎬 Using FPS: $FPS"
else
    FPS=10
    echo "🎬 Using default FPS: $FPS"
fi

# Count frames
FRAME_COUNT=$(ls -1 "$FRAMES_DIR"/frame_*.png 2>/dev/null | wc -l)
echo "📸 Found $FRAME_COUNT frames"

# Create output filename
OUTPUT="${SYMBOL}_$(date +%Y%m%d_%H%M%S).mp4"

# Convert to MP4 (Instagram/TikTok ready)
echo "🎥 Creating MP4 video..."
ffmpeg -framerate $FPS -pattern_type glob -i "$FRAMES_DIR/frame_*.png" \
  -c:v libx264 -pix_fmt yuv420p \
  -vf "scale=1080:1920:force_original_aspect_ratio=1,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" \
  -movflags +faststart \
  "$OUTPUT"

if [ $? -eq 0 ]; then
    echo "✅ Done! Video saved as: $OUTPUT"
    echo "📊 File size: $(du -h "$OUTPUT" | cut -f1)"
else
    echo "❌ Failed to create video"
fi