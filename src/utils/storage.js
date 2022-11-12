// 本地存储封装模块

export const getItem = name => {
  const data = window.localStorage.getItem(name)
  try {
    // 为什么放入try-catch中：data可能不是json格式字符串
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

export const setItem = (name, value) => {
  // 如果value是对象，转为json再存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(name, value)
}

export const removeItem = name => {
  window.localStorage.removeItem(name)
}
