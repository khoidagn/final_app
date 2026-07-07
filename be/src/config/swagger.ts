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
          summary: 'Register a new user account',
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
            201: {
              description: 'Registration successful. Verification email sent.',
            },
            400: {
              description: 'Email already registered or invalid input data.',
            },
          },
        },
      },
      '/auth/verify-email': {
        get: {
          tags: ['Authentication'],
          summary: 'Verify user email address via token',
          parameters: [
            {
              name: 'token',
              in: 'query',
              required: true,
              description:
                'The expiring secure JWT verification token sent to user email',
              schema: {
                type: 'string',
              },
            },
          ],
          responses: {
            200: {
              description:
                'Email verified successfully. Account is now ready for login.',
            },
            400: {
              description: 'Verification link is invalid or has expired.',
            },
            404: { description: 'User account not found.' },
          },
        },
      },
      '/auth/resend-verification': {
        post: {
          tags: ['Authentication'],
          summary: 'Resend verification email for unverified account',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: {
                      type: 'string',
                      example: 'khoi.vo2026@example.com',
                    },
                  },
                },
              },
            },
            responses: {
              200: { description: 'Verification email resent successfully.' },
              400: { description: 'Email is already verified.' },
              404: { description: 'User with this email address not found.' },
            },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Log into the system',
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
            200: {
              description:
                'Login successful. Access token and refresh token generated.',
            },
            401: {
              description:
                'Incorrect credentials, account deactivated, or unverified email.',
            },
          },
        },
      },
      '/auth/refresh': {
        post: {
          tags: ['Authentication'],
          summary: 'Renew Access Token automatically (Silent Refresh)',
          responses: {
            200: { description: 'Returns a new valid Access Token.' },
            401: { description: 'Invalid or expired refresh token.' },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Log out from the system',
          responses: {
            200: { description: 'Session cookies cleared successfully.' },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Authentication'],
          summary: 'Retrieve current authenticated user profile',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Profile data retrieved successfully.' },
            401: { description: 'Token is expired or invalid.' },
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
              'multipart/form-data': {
                schema: {
                  type: 'object',
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
      '/albums/discovery_albums': {
        get: {
          tags: ['Albums'],
          summary: 'Khám phá album công khai toàn hệ thống (Phân trang)',
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
            200: { description: 'Lấy danh sách album thành công.' },
          },
        },
      },
      '/albums/feeds_albums': {
        get: {
          tags: ['Albums'],
          summary: 'Lấy album từ những người đang theo dõi (Phân trang)',
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
          responses: { 200: { description: 'Lấy feed album thành công.' } },
        },
      },
      '/albums/my_albums': {
        get: {
          tags: ['Albums'],
          summary:
            'Lấy danh sách album của chính người dùng hiện tại (Cá nhân)',
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
            200: { description: 'Lấy danh sách ảnh album cá nhân thành công.' },
          },
        },
      },
      '/albums/upload': {
        post: {
          tags: ['Albums'],
          summary:
            'Tạo một Album mới với nhiều hình ảnh cùng lúc (Multiple Uploads)',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['title', 'description', 'images'],
                  properties: {
                    images: {
                      type: 'array',
                      items: {
                        type: 'string',
                        format: 'binary',
                      },
                      description:
                        'Mảng các file ảnh tải lên Album (Tối đa 25 files, < 5MB/file)',
                    },
                    title: {
                      type: 'string',
                      example: 'Kỷ niệm Mùa Hè 2026',
                      description: 'Tiêu đề của Album (Tối đa 140 ký tự)',
                    },
                    description: {
                      type: 'string',
                      example:
                        'Tổng hợp hình ảnh chuyến đi thực tập và teambuilding',
                      description: 'Mô tả chi tiết Album (Tối đa 300 ký tự)',
                    },
                    sharingMode: {
                      type: 'string',
                      enum: ['PUBLIC', 'PRIVATE'],
                      default: 'PUBLIC',
                      example: 'PUBLIC',
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Tạo Album và tải bộ ảnh lên thành công.' },
            400: { description: 'Dữ liệu thiếu hoặc tệp tin không hợp lệ.' },
            401: { description: 'Chưa xác thực tài khoản.' },
            500: { description: 'Lỗi hệ thống nội bộ.' },
          },
        },
      },
      '/albums/{id}': {
        put: {
          tags: ['Albums'],
          summary:
            'Chỉnh sửa thông tin chi tiết Album (Chỉ dành cho chủ sở hữu)',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của Album cần sửa',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                      example: 'Tiêu đề album mới cập nhật',
                    },
                    description: {
                      type: 'string',
                      example: 'Mô tả mới sau chỉnh sửa',
                    },
                    sharingMode: {
                      type: 'string',
                      enum: ['PUBLIC', 'PRIVATE'],
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật Album thành công.' },
            403: { description: 'Bạn không có quyền chỉnh sửa Album này.' },
            404: { description: 'Không tìm thấy Album.' },
          },
        },
        delete: {
          tags: ['Albums'],
          summary:
            'Xóa hoàn toàn Album và dọn rác Media liên quan (Cascade Delete)',
          description:
            'Hệ thống tự động quét sạch các ảnh vật lý đính kèm trên Cloudinary trước khi hủy liên kết trong DB.',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của Album cần xóa',
            },
          ],
          responses: {
            200: {
              description: 'Xóa Album và toàn bộ tài nguyên Media thành công.',
            },
            401: { description: 'Chưa đăng nhập.' },
            403: {
              description: 'Bạn không có quyền xóa Album của người khác.',
            },
            404: { description: 'Không tìm thấy Album tương ứng.' },
          },
        },
      },

      /* ---------------- MODULE INTERACTION ---------------- */
      '/interactions/photos/{id}/like': {
        post: {
          tags: ['Interactions'],
          summary: 'Thả tim hoặc bỏ thích một bức ảnh (Toggle Like)',
          description:
            'Nếu chưa thích thì sẽ tạo bản ghi và tăng bộ đếm likesCount. Nếu đã thích trước đó thì sẽ xóa bản ghi và giảm bộ đếm.',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của bức ảnh',
            },
          ],
          responses: {
            200: {
              description: 'Xử lý tương tác thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      liked: { type: 'boolean', example: true },
                      message: {
                        type: 'string',
                        example: 'Liked successfully.',
                      },
                    },
                  },
                },
              },
            },
            401: { description: 'Chưa đăng nhập.' },
            404: { description: 'Không tìm thấy bức ảnh.' },
          },
        },
      },
      '/interactions/albums/{id}/like': {
        post: {
          tags: ['Interactions'],
          summary: 'Thả tim hoặc bỏ thích một Album (Toggle Like)',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của Album',
            },
          ],
          responses: {
            200: { description: 'Xử lý tương tác thích Album thành công.' },
            401: { description: 'Chưa đăng nhập.' },
            404: { description: 'Không tìm thấy Album.' },
          },
        },
      },
      '/interactions/users/{id}/follow': {
        post: {
          tags: ['Interactions'],
          summary: 'Theo dõi hoặc hủy theo dõi một người dùng (Toggle Follow)',
          description:
            'Hệ thống tự động tăng/giảm đồng thời cặp bộ đếm followingsCount của bạn và followersCount của đối phương trong một Database Transaction.',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của người dùng bạn muốn Theo dõi / Hủy theo dõi',
            },
          ],
          responses: {
            200: {
              description: 'Cập nhật trạng thái theo dõi thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      followed: { type: 'boolean', example: true },
                      message: {
                        type: 'string',
                        example: 'Followed successfully.',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Lỗi logic: Bạn không được tự theo dõi chính mình.',
            },
            401: { description: 'Chưa đăng nhập.' },
            404: { description: 'Không tìm thấy người dùng này.' },
          },
        },
      },
      /* ---------------- MODULE ADMIN ---------------- */
      '/admin/photos': {
        get: {
          tags: ['Admin Management'],
          summary:
            'Giám sát toàn bộ hình ảnh hệ thống (Bao gồm PRIVATE - Phân trang 40 items)',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Số trang kiểm tra',
            },
          ],
          responses: {
            200: {
              description:
                'Trả về danh sách hình ảnh kiểm tra master thành công.',
            },
            403: { description: 'Từ chối truy cập: Bạn không phải Admin.' },
          },
        },
      },
      '/admin/photos/{id}': {
        delete: {
          tags: ['Admin Management'],
          summary:
            'Xóa bất kỳ bức ảnh nào vi phạm tiêu chuẩn trên toàn hệ thống',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của bức ảnh cần xóa vĩnh viễn',
            },
          ],
          responses: {
            200: { description: 'Photo deleted successfully by Admin.' },
            401: { description: 'Authentication required.' },
            403: { description: 'Access denied. Admin role required.' },
            404: { description: 'Photo not found.' },
          },
        },
      },
      '/admin/albums': {
        get: {
          tags: ['Admin Management'],
          summary:
            'Giám sát toàn bộ album hệ thống (Bao gồm PRIVATE - Phân trang 40 items)',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
            },
          ],
          responses: {
            200: { description: 'Trả về danh sách album master thành công.' },
          },
        },
      },
      '/admin/albums/{id}': {
        delete: {
          tags: ['Admin Management'],
          summary:
            'Xóa bất kỳ album nào kèm dọn dẹp sạch file vật lý trên Cloudinary',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của album cần xóa vĩnh viễn',
            },
          ],
          responses: {
            200: {
              description:
                'Album and its associated media files deleted successfully.',
            },
            401: { description: 'Authentication required.' },
            403: { description: 'Access denied. Admin role required.' },
            404: { description: 'Album not found.' },
          },
        },
      },
      '/admin/users/{id}': {
        patch: {
          tags: ['Admin Management'],
          summary:
            'Thay đổi trạng thái hoạt động (Khóa/Mở khóa) của một tài khoản người dùng',
          description:
            'Hệ thống tự động biên dịch mẫu thông báo bằng Pug để chuẩn bị gửi cảnh báo email cho User.',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID người dùng cần xử lý',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['isActive'],
                  properties: {
                    isActive: {
                      type: 'boolean',
                      example: false,
                      description:
                        'Đặt false để đình chỉ tài khoản, true để khôi phục',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Cập nhật trạng thái tài khoản thành công.' },
            400: {
              description:
                'Tham số không hợp lệ hoặc cố tình tác động tài khoản Admin khác.',
            },
            404: { description: 'Không tìm thấy người dùng.' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
