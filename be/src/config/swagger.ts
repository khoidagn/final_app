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
      '/photos/discovery_photos': {
        get: {
          tags: ['Photos'],
          summary: 'Khám phá hình ảnh công khai toàn hệ thống (Phân trang)',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Số trang hiện tại',
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 },
              description: 'Số lượng ảnh trên mỗi trang',
            },
          ],
          responses: {
            200: { description: 'Lấy danh sách hình ảnh khám phá thành công.' },
          },
        },
      },
      '/photos/feeds_photos': {
        get: {
          tags: ['Photos'],
          summary: 'Lấy hình ảnh từ những người đang theo dõi (Phân trang)',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 },
            },
          ],
          responses: {
            200: { description: 'Lấy danh sách feed ảnh thành công.' },
            401: { description: 'Chưa đăng nhập hoặc token hết hạn.' },
          },
        },
      },
      '/photos/my_photos': {
        get: {
          tags: ['Photos'],
          summary:
            'Lấy danh sách hình ảnh của chính người dùng hiện tại (Cá nhân)',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'page',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 1 },
              description: 'Số thứ tự trang hiển thị',
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 10 },
              description: 'Số lượng hình ảnh trên một trang',
            },
          ],
          responses: {
            200: { description: 'Lấy danh sách ảnh cá nhân thành công.' },
            401: { description: 'Chưa đăng nhập hoặc token không hợp lệ.' },
            500: { description: 'Lỗi hệ thống nội bộ.' },
          },
        },
      },
      '/photos/upload': {
        post: {
          tags: ['Photos'],
          summary:
            'Đăng tải một hình ảnh mới (Dưới 5MB, chuẩn định dạng ảnh jpeg, png, jpg, gif)',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['photo', 'title', 'description'],
                  properties: {
                    photo: {
                      type: 'string',
                      format: 'binary',
                      description:
                        'File ảnh cần upload (jpeg, png, jpg, gif < 5MB)',
                    },
                    title: {
                      type: 'string',
                      example: 'Chuyến đi Đà Lạt',
                      description: 'Tiêu đề bức ảnh (Tối đa 140 ký tự)',
                    },
                    description: {
                      type: 'string',
                      example: 'Ảnh chụp hoàng hôn tại đỉnh Langbiang',
                      description: 'Mô tả chi tiết bức ảnh (Tối đa 300 ký tự)',
                    },
                    sharingMode: {
                      type: 'string',
                      enum: ['PUBLIC', 'PRIVATE'],
                      default: 'PUBLIC',
                      example: 'PUBLIC',
                      description:
                        'Chế độ hiển thị của ảnh (PUBLIC hoặc PRIVATE)',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Đăng hình ảnh thành công.' },
            400: {
              description:
                'Dữ liệu không hợp lệ, file không đúng định dạng hoặc vượt quá 5MB.',
            },
            401: { description: 'Chưa đăng nhập hoặc token không hợp lệ.' },
            500: { description: 'Lỗi hệ thống nội bộ.' },
          },
        },
      },
      '/photos/{id}': {
        put: {
          tags: ['Photos'],
          summary: 'Chỉnh sửa thông tin và hình ảnh (Chỉ dành cho chủ sở hữu)',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của hình ảnh cần chỉnh sửa',
            },
          ],
          requestBody: {
            required: true,
            content: {
              // ĐỔI THÀNH: multipart/form-data để hỗ trợ đính kèm tệp tin mới nếu muốn thay ảnh
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  // Lưu ý: Không đặt 'required' cho các trường này vì khi update, người dùng có thể chỉ muốn sửa title hoặc chỉ muốn thay ảnh lẻ.
                  properties: {
                    photo: {
                      type: 'string',
                      format: 'binary',
                      description:
                        'File ảnh mới nếu muốn thay thế ảnh cũ (jpeg, png, jpg, gif < 5MB)',
                    },
                    title: {
                      type: 'string',
                      example: 'Tiêu đề đã cập nhật',
                      description: 'Tiêu đề bức ảnh mới (Tối đa 140 ký tự)',
                    },
                    description: {
                      type: 'string',
                      example: 'Mô tả mới sau khi chỉnh sửa',
                      description:
                        'Mô tả chi tiết bức ảnh mới (Tối đa 300 ký tự)',
                    },
                    sharingMode: {
                      type: 'string',
                      enum: ['PUBLIC', 'PRIVATE'],
                      example: 'PUBLIC',
                      description:
                        'Chế độ hiển thị của ảnh (PUBLIC hoặc PRIVATE)',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật thông tin hình ảnh thành công.' },
            400: {
              description:
                'Dữ liệu không hợp lệ hoặc file tải lên sai định dạng.',
            },
            401: { description: 'Chưa đăng nhập hoặc token hết hạn.' },
            403: {
              description:
                'Forbidden: Bạn không có quyền sửa tài nguyên của người khác.',
            },
            404: {
              description: 'Không tìm thấy hình ảnh tương ứng trong hệ thống.',
            },
            500: { description: 'Lỗi hệ thống nội bộ.' },
          },
        },
        delete: {
          tags: ['Photos'],
          summary: 'Xóa hình ảnh khỏi hệ thống (Chỉ dành cho chủ sở hữu)',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của hình ảnh cần xóa',
            },
          ],
          responses: {
            200: {
              description:
                'Xóa ảnh thành công và đã dọn dẹp file vật lý trên Cloudinary.',
            },
            401: { description: 'Chưa đăng nhập.' },
            403: {
              description:
                'Forbidden: Bạn không có quyền xóa tài nguyên của người khác.',
            },
            404: { description: 'Không tìm thấy hình ảnh cần xóa.' },
            500: { description: 'Lỗi hệ thống nội bộ.' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
