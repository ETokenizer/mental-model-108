// API 工具函数
export async function fetchModels() {
  const response = await fetch('/mental_models.json')
  return response.json()
}

export async function fetchModelById(id) {
  const data = await fetchModels()
  return data.models.find(m => m.id === parseInt(id))
}
