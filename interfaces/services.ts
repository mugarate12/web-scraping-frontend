export interface Service {
  name: string,
  content: {
    url: string,
    title: string,
    status: string,
    baseline: Array<{
      x: string,
      y: number
    }>,
    reports: Array<{
      x: string,
      y: number
    }>
  }
}