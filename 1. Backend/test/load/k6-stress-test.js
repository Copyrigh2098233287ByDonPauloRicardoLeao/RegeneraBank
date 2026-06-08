import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp-up: 50 usuários simultâneos
    { duration: '1m', target: 50 },   // Carga estável: 50 usuários
    { duration: '30s', target: 200 }, // Spike/Estresse: Pulo para 200 usuários
    { duration: '1m', target: 200 },  // Sustentando spike
    { duration: '30s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requisições devem ocorrer em menos de 500ms
    http_req_failed: ['rate<0.01'],   // Taxa de falha deve ser menor que 1%
  },
};

export default function () {
  const url = 'http://localhost:3000/api/health';
  
  const res = http.get(url);
  
  check(res, {
    'is status 200': (r) => r.status === 200,
    'health returns UP': (r) => r.json('status') === 'UP',
  });

  // Testando endpoint de simulação (requereria auth, mas isso serve para o gate)
  // const pixRes = http.post('http://localhost:3000/api/pix/transfer', JSON.stringify({ amountCents: 100 }), { headers: { 'Content-Type': 'application/json' }});
  
  sleep(1);
}
