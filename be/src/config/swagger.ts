import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fotobook API Documentation',
      version: '1.0.0',
      description: 'Tài liệu API hệ thống.',
    },
    servers: [
      {
        url: 'http://localhost:3002/api/v1',
        description: 'Dev Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Nhập Access Token vào đây để mở khóa các API bảo mật.',
        },
      },
    },
    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Đăng ký tài khoản người dùng mới',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['firstName', 'lastName', 'email', 'password'],
                  properties: {
                    firstName: { type: 'string', example: 'Dang' },
                    lastName: { type: 'string', example: 'Khoi' },
                    email: {
                      type: 'string',
                      example: 'khoi.vo2026@example.com',
                    },
                    password: {
                      type: 'string',
                      example: 'mysecurepassword123',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Đăng ký thành công.' },
            400: { description: 'Dữ liệu không hợp lệ.' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Đăng nhập hệ thống',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: {
                      type: 'string',
                      example: 'khoi.vo2026@example.com',
                    },
                    password: {
                      type: 'string',
                      example: 'mysecurepassword123',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Đăng nhập thành công, cấp cặp đôi Token.' },
          },
        },
      },
      '/auth/refresh': {
        post: {
          tags: ['Authentication'],
          summary: 'Gia hạn Access Token tự động (Silent Refresh)',
          responses: {
            200: { description: 'Trả về Access Token mới.' },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Đăng xuất khỏi hệ thống',
          responses: {
            200: { description: 'Xóa sạch Session Cookie thành công.' },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Authentication'],
          summary: 'Lấy thông tin hồ sơ cá nhân hiện tại',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Lấy thông tin thành công.' },
            401: { description: 'Token hết hạn hoặc không hợp lệ.' },
          },
        },
      },
      '/auth/admin-dashboard': {
        get: {
          tags: ['Authorization'],
          summary: 'Cổng thông tin tối cao dành riêng cho Admin',
          description:
            'Yêu cầu Access Token phải thuộc về tài khoản có chức vụ quyền hạn là admin.',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Chào mừng Admin truy cập thành công.' },
            403: {
              description:
                'Lỗi phân quyền: Bạn là User thường, không có quyền vào.',
            },
            401: { description: 'Chưa đăng nhập hoặc token không hợp lệ.' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
