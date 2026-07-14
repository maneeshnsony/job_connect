import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    errors: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:8000/api';

export default function () {
  // Health check
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, { 'health status 200': (r) => r.status === 200 });
  errorRate.add(healthRes.status !== 200);

  // Login
  const loginRes = http.post(`${BASE_URL}/login`, {
    email: 'test@example.com',
    password: 'password123!',
  });
  check(loginRes, { 'login status 200': (r) => r.status === 200 });
  errorRate.add(loginRes.status !== 200);

  if (loginRes.status === 200) {
    const token = loginRes.json('token');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // List outreaches
    const listRes = http.get(`${BASE_URL}/outreaches?per_page=20`, { headers });
    check(listRes, { 'list status 200': (r) => r.status === 200 });
    responseTime.add(listRes.timings.duration);
    errorRate.add(listRes.status !== 200);

    // Create outreach
    const createRes = http.post(`${BASE_URL}/outreaches`, JSON.stringify({
      company: `Test Corp ${__VU}`,
      sector: 'Tech',
      recruiter: `Recruiter ${__VU}`,
    }), { headers });
    check(createRes, { 'create status 201': (r) => r.status === 201 });
    errorRate.add(createRes.status !== 201);
  }

  sleep(1);
}
