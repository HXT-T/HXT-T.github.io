import { useEffect, useRef } from 'react'

// 樱花飘落画布 —— 绝对定位铺在父容器里（首页 hero），
// 尊重 prefers-reduced-motion，卸载时自动清理
const COLORS = [
  'rgba(255, 183, 213, ',
  'rgba(255, 153, 193, ',
  'rgba(255, 209, 228, ',
  'rgba(250, 162, 193, ',
]

export default function Sakura({ density = 24 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rand = (a, b) => a + Math.random() * (b - a)
    let raf = 0
    let w = 0
    let h = 0
    const petals = []

    const spawn = (initial) => ({
      x: rand(0, w),
      y: initial ? rand(-h, h) : rand(-40, -10),
      size: rand(6, 13),
      speed: rand(0.4, 1.1),
      sway: rand(0.5, 1.6),
      phase: rand(0, Math.PI * 2),
      rot: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.02, 0.02),
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: rand(0.5, 0.9),
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // 画一瓣樱花：两段贝塞尔曲线合成的花瓣轮廓
    const draw = (p) => {
      const s = p.size
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.beginPath()
      ctx.moveTo(0, -s)
      ctx.bezierCurveTo(s * 0.9, -s * 0.7, s * 0.7, s * 0.5, 0, s)
      ctx.bezierCurveTo(-s * 0.7, s * 0.5, -s * 0.9, -s * 0.7, 0, -s)
      ctx.fillStyle = p.color + p.alpha + ')'
      ctx.fill()
      ctx.restore()
    }

    const tick = (t) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of petals) {
        p.y += p.speed
        p.x += Math.sin((t / 1000) * p.sway + p.phase) * 0.4
        p.rot += p.rotSpeed
        if (p.y > h + 20) Object.assign(p, spawn(false))
        draw(p)
      }
      raf = requestAnimationFrame(tick)
    }

    resize()
    for (let i = 0; i < density; i += 1) petals.push(spawn(true))
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [density])

  return <canvas ref={canvasRef} className="sakura-canvas" aria-hidden="true" />
}
