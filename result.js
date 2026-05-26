// result.js

const API_BASE_URL = "https://guide-angles-muzzle.ngrok-free.dev";

const params = new URLSearchParams(window.location.search);
const docId = params.get("id");

const resultImg = document.getElementById("resultImg");
const resultText = document.getElementById("resultText");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const CLASS_KO = {
  Healthy: "정상",
  Mild: "경증",
  Moderate: "중등도",
  Severe: "중증",
  Proliferative: "증식성",
};

function toPercent(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "0.00%";
  return `${(num * 100).toFixed(2)}%`;
}

function renderPrediction(prediction) {
  if (!prediction) {
    resultText.textContent = "AI 분석 결과가 없습니다.";
    return;
  }

  const className = prediction.predictedClassName || prediction.predicted_class_name || "알 수 없음";
  const classId = prediction.predictedClassId ?? prediction.predicted_class_id ?? 0;
  const probabilities = prediction.probabilities || {};

  // 예측 결과 텍스트
  resultText.innerHTML = `
    <strong style="font-size:18px; color:var(--navy);">
      ${CLASS_KO[className] || className}
    </strong>
    <span style="font-size:13px; color:var(--accent); margin-left:10px;">
      (단계 ${classId})
    </span>
  `;

  // 진행도 바 (0~4단계 → 0~100%)
  const fillWidth = (classId / 4) * 100;
  progressFill.style.width = `${fillWidth}%`;

  // 클래스별 확률 표시
const orderedClasses = [
  "Healthy",
  "Mild",
  "Moderate",
  "Severe",
  "Proliferative",
];

const probRows = orderedClasses
  .map((key) => {
    const value = probabilities[key] || 0;
    const pct = (Number(value) * 100).toFixed(1);

    return `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
        <span style="width:60px; font-size:13px; color:var(--navy-mid); opacity:0.8;">
          ${CLASS_KO[key]}
        </span>

        <div style="
          flex:1;
          height:6px;
          background:rgba(26,42,94,0.1);
          border-radius:999px;
          overflow:hidden;
        ">
          <div style="
            width:${pct}%;
            height:100%;
            background:linear-gradient(90deg, var(--navy-mid), var(--accent));
            border-radius:999px;
          "></div>
        </div>

        <span style="
          width:48px;
          font-size:13px;
          color:var(--navy-mid);
          text-align:right;
        ">
          ${pct}%
        </span>
      </div>
    `;
  })
  .join("");

  progressText.innerHTML = `
    <div style="margin-top:8px;">
      <div style="font-size:12px; font-weight:600; letter-spacing:2px; color:var(--accent); margin-bottom:12px;">
        클래스별 확률
      </div>
      ${probRows}
    </div>
  `;
}

async function loadResult() {
  try {
    console.log("찾는 문서 ID:", docId);

    if (!resultImg || !resultText) {
      console.error("resultImg 또는 resultText 요소를 찾을 수 없습니다.");
      return;
    }

    if (!docId || docId === "undefined" || docId === "null") {
      resultText.textContent = "문서 ID가 없거나 올바르지 않습니다. 다시 업로드해주세요.";
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
      resultText.textContent = result.message || "이미지 정보를 불러오지 못했습니다.";
      return;
    }

    const image = result.image || result;

    if (!image || !image.imageUrl) {
      resultText.textContent = "이미지 URL이 없습니다.";
      return;
    }

    resultImg.src = image.imageUrl;
    resultImg.style.display = "block";

    const prediction = result.prediction || image.prediction;
    renderPrediction(prediction);

  } catch (error) {
    console.error("불러오기 실패:", error);
    resultText.textContent = `오류: ${error.message}`;
  }
}

loadResult();