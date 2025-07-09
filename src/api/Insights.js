import instance from ".";

export const getPrediction = async (inputData) => {
  try {
    const { data } = await instance.post("/flask/predict", { data: inputData });
    return data;
  } catch (error) {
    console.error("Prediction error:", error.response?.data || error.message);
    throw error;
  }
};

export const getBatchPrediction = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await instance.post("/flask/predict-batch", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data.predictions; // array of 0/1
  } catch (error) {
    console.error(
      "Batch prediction error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getSavedPredictions = async () => {
  try {
    const { data } = await instance.get("/flask/user-predictions");
    return data.predictions;
  } catch (error) {
    console.error(
      "Error loading saved predictions:",
      error.response?.data || error.message
    );
    return [];
  }
};
