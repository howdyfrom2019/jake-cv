import { buildLlmsFullTxt } from '@/lib/llms'

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}
