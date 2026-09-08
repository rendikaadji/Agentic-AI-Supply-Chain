#!/bin/bash
# StockMind AI - Wrapper training lokal: YOLOv8n lalu YOLOv8s, berurutan, di background.
# Jalankan dari root stockmind-ai (Git Bash):
#   nohup bash computer_vision/scripts/run_training_background.sh > computer_vision/logs/run_wrapper.log 2>&1 &
#   disown
# Cek status akhir di: computer_vision/results/train_status.txt
# Log per-model: computer_vision/logs/train_yolov8n.log , computer_vision/logs/train_yolov8s.log

set -uo pipefail
cd "$(dirname "$0")/../.." || exit 1

VENV_ACTIVATE=".venv_train/Scripts/activate"
LOG_DIR="computer_vision/logs"
STATUS_FILE="computer_vision/results/train_status.txt"
COMMON_ARGS=(--epochs 100 --patience 20 --optimizer AdamW --save-period 5)

mkdir -p "$LOG_DIR" "$(dirname "$STATUS_FILE")"
# shellcheck disable=SC1091
source "$VENV_ACTIVATE"

{
  echo "training_started_at=$(date -Iseconds)"
  echo "yolov8n_status=RUNNING"
} > "$STATUS_FILE"

python computer_vision/scripts/train_yolov8.py \
    --model yolov8n.pt "${COMMON_ARGS[@]}" \
    --name cardboard_box_yolov8n \
    --project computer_vision/results/train \
    --export-dir computer_vision/models/yolov8n \
    > "$LOG_DIR/train_yolov8n.log" 2>&1
N_EXIT=$?

if [ $N_EXIT -eq 0 ]; then
    sed -i 's/yolov8n_status=RUNNING/yolov8n_status=SUCCESS/' "$STATUS_FILE"
else
    sed -i 's/yolov8n_status=RUNNING/yolov8n_status=FAILED/' "$STATUS_FILE"
    {
      echo "yolov8s_status=SKIPPED (yolov8n gagal, exit code $N_EXIT - cek $LOG_DIR/train_yolov8n.log)"
      echo "training_finished_at=$(date -Iseconds)"
    } >> "$STATUS_FILE"
    exit 1
fi

echo "yolov8s_status=RUNNING" >> "$STATUS_FILE"

python computer_vision/scripts/train_yolov8.py \
    --model yolov8s.pt "${COMMON_ARGS[@]}" \
    --name cardboard_box_yolov8s \
    --project computer_vision/results/train \
    --export-dir computer_vision/models/yolov8s \
    > "$LOG_DIR/train_yolov8s.log" 2>&1
S_EXIT=$?

if [ $S_EXIT -eq 0 ]; then
    sed -i 's/yolov8s_status=RUNNING/yolov8s_status=SUCCESS/' "$STATUS_FILE"
else
    sed -i "s|yolov8s_status=RUNNING|yolov8s_status=FAILED (exit code $S_EXIT - cek $LOG_DIR/train_yolov8s.log)|" "$STATUS_FILE"
fi

echo "training_finished_at=$(date -Iseconds)" >> "$STATUS_FILE"
