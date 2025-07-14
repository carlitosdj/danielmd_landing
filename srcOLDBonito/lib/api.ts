import axios, { AxiosInstance, AxiosResponse } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010'

export class ApiClient {
  private client: AxiosInstance

  constructor() {
    console.log('Inicializando API client com URL:', API_BASE_URL)
    
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    // Interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error('Erro na API:', error)
        
        if (error.response) {
          // Erro com resposta do servidor
          const message = error.response.data?.message || 
                          error.response.statusText || 
                          `Erro ${error.response.status}`
          throw new Error(message)
        } else if (error.request) {
          // Erro de rede
          throw new Error('Erro de conexão. Verifique se a API está rodando na porta 3010.')
        } else {
          // Erro na configuração da requisição
          throw new Error('Erro interno. Tente novamente.')
        }
      }
    )

    // Bind dos métodos para preservar contexto nas sagas
    this.get = this.get.bind(this)
    this.post = this.post.bind(this)
    this.put = this.put.bind(this)
    this.delete = this.delete.bind(this)
  }

  // Métodos normais que serão bound no constructor
  async get<T>(endpoint: string): Promise<AxiosResponse<T>> {
    console.log('GET:', endpoint)
    return this.client.get<T>(endpoint)
  }

  async post<T>(endpoint: string, data?: any): Promise<AxiosResponse<T>> {
    console.log('POST:', endpoint, data)
    return this.client.post<T>(endpoint, data)
  }

  async put<T>(endpoint: string, data?: any): Promise<AxiosResponse<T>> {
    console.log('PUT:', endpoint, data)
    return this.client.put<T>(endpoint, data)
  }

  async delete<T>(endpoint: string): Promise<AxiosResponse<T>> {
    console.log('DELETE:', endpoint)
    return this.client.delete<T>(endpoint)
  }
}

const api = new ApiClient()
export default api