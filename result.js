// result.js

const API_BASE_URL = "https://guide-angles-muzzle.ngrok-free.dev";

const params = new URLSearchParams(window.location.search);
const docId = params.get("id");

const resultImg = document.getElementById("resultImg");
const resultText = document.getElementById("resultText");

const CLASS_KO = {
  Healthy: "정상",
  Mild: "경증",
  Moderate: "중등도",
  Severe: "중증",
  Proliferative: "증식성",
};

function toPercent(value) {
  const num = Number(value);

  if (Number.isNaN(num)) {
    return "0.00%";
  }

  return `${(num * 100).toFixed(2)}%`;
}

function makePredictionText(prediction) {
  if (!prediction) {
    return "AI 분석 결과가 없습니다.";
  }

  const className =
    prediction.predictedClassName ||
    prediction.predicted_class_name ||
    "알 수 없음";

  const classId =
    prediction.predictedClassId ??
    prediction.predicted_class_id ??
    "알 수 없음";

  const probabilities = prediction.probabilities || {};

  let text = "";

  text += `예측 결과: ${CLASS_KO[className] || className}\n`;
  text += `예측 클래스 ID: ${classId}\n\n`;
  text += `클래스별 확률\n`;

  for (const [key, value] of Object.entries(probabilities)) {
    text += `- ${CLASS_KO[key] || key}: ${toPercent(value)}\n`;
  }

  return text;
}

async function loadResult() {
  try {
    console.log("찾는 문서 ID:", docId);

    if (!resultImg || !resultText) {
      console.error("resultImg 또는 resultText 요소를 찾을 수 없습니다.");
      return;
    }

    if (!docId || docId === "undefined" || docId === "null") {
      resultText.textContent =
        "문서 ID가 없거나 올바르지 않습니다. 다시 업로드해주세요.";
      console.error("docId가 올바르지 않습니다:", docId);
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/images/${encodeURIComponent(docId)}`,
      {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "1",
        },
      }
    );

    const result = await response.json();

    console.log("이미지 조회 응답:", result);

    if (!response.ok) {
      resultText.textContent =
        result.message || "이미지 정보를 불러오지 못했습니다.";
      console.error("이미지 조회 실패:", result);
      return;
    }

    const image = result.image || result;

    if (!image || !image.imageUrl) {
      resultText.textContent = "이미지 URL이 없습니다.";
      console.error("imageUrl 없음:", result);
      return;
    }

    resultImg.src = image.imageUrl;
    resultImg.style.display = "block";

    const prediction = result.prediction || image.prediction;

    resultText.textContent = makePredictionText(prediction);
  } catch (error) {
    console.error("불러오기 실패:", error);
    resultText.textContent = `오류: ${error.message}`;
  }
}

loadResult();