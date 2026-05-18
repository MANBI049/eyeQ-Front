// result.js

const API_BASE_URL = "https://guide-angles-muzzle.ngrok-free.dev";

const params = new URLSearchParams(window.location.search);
const docId = params.get("id");

const resultImg = document.getElementById("resultImg");
const resultText = document.getElementById("resultText");

async function loadResult() {
  try {
    console.log("찾는 문서 ID:", docId);

    if (!docId) {
      resultText.textContent = "문서 ID가 없습니다. result.html?id=문서ID 형태로 접근해야 합니다.";
      console.error("docId가 없습니다.");
      return;
    }

    if (!resultImg || !resultText) {
      console.error("resultImg 또는 resultText 요소를 찾을 수 없습니다.");
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/images/${encodeURIComponent(docId)}`, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "1",
      },
    });

    const result = await response.json();

    console.log("이미지 조회 응답:", result);

    if (!response.ok) {
      resultText.textContent = result.message || "이미지 정보를 불러오지 못했습니다.";
      console.error("이미지 조회 실패:", result);
      return;
    }

    const image = result.image;

    if (!image || !image.imageUrl) {
      resultText.textContent = "이미지 URL이 없습니다.";
      console.error("imageUrl 없음:", result);
      return;
    }

    resultImg.src = image.imageUrl;
    resultImg.style.display = "block";

    resultText.textContent = "모델 연결 후 결과가 표시됩니다.";
  } catch (error) {
    console.error("불러오기 실패:", error);
    resultText.textContent = `오류: ${error.message}`;
  }
}

loadResult();