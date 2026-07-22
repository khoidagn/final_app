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
      /* ---------------- MODULE AUTH ---------------- */
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
      '/auth/check-status': {
        get: {
          tags: ['Authentication'],
          summary:
            'Kiểm tra trạng thái xác thực email của tài khoản (Dùng cho màn hình chờ FE)',
          parameters: [
            {
              name: 'email',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Email của tài khoản cần check trạng thái kích hoạt',
            },
          ],
          responses: {
            200: {
              description: 'Trả về trạng thái kích hoạt.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      data: {
                        type: 'object',
                        properties: {
                          email: {
                            type: 'string',
                            example: 'user@example.com',
                          },
                          isConfirmed: { type: 'boolean', example: true },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: { description: 'Không tìm thấy Email này trong hệ thống.' },
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
                      example: 'admin.fotobook@example.com',
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
      '/auth/forgot-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Yêu cầu gửi liên kết đặt lại mật khẩu qua Email',
          description:
            'Nhận email của người dùng, kiểm tra hệ thống và gửi email chứa token khôi phục mật khẩu (Hạn dùng 15 phút).',
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
                      format: 'email',
                      example: 'khoi.vo2026@example.com',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Gửi link reset password thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      data: {
                        type: 'object',
                        properties: {
                          message: {
                            type: 'string',
                            example:
                              'Password reset link has been sent to your email.',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Không tìm thấy địa chỉ Email này trong hệ thống.',
            },
            500: { description: 'Lỗi dịch vụ Mail SMTP không thể đẩy thư đi.' },
          },
        },
      },
      '/auth/reset-password': {
        post: {
          tags: ['Authentication'],
          summary: 'Thực hiện đặt lại mật khẩu mới bằng token khôi phục',
          description:
            'FE bốc tách token từ URL để gửi kèm với mật khẩu mới. Backend verify JWT và ghi đè mật khẩu mới vào cơ sở dữ liệu.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['token', 'newPassword'],
                  properties: {
                    token: {
                      type: 'string',
                      description:
                        'Mã token JWT đính kèm nhận từ hòm thư Email',
                      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                    newPassword: {
                      type: 'string',
                      minLength: 6,
                      description: 'Mật khẩu mới mong muốn thiết lập',
                      example: 'newsecurepass123',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Cập nhật lại mật khẩu thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      data: {
                        type: 'object',
                        properties: {
                          message: {
                            type: 'string',
                            example:
                              'Password has been successfully reset. You can now log in with your new password.',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description:
                'Mã token khôi phục không hợp lệ, bị giả mạo hoặc đã hết hạn.',
            },
          },
        },
      },

      /* ---------------- MODULE USER ---------------- */
      '/users/me': {
        get: {
          tags: ['User Profile'],
          summary:
            'Lấy thông tin profile và các chỉ số thống kê của chính mình',
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: 'Trả về thông tin cá nhân thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: {
                        type: 'string',
                        example: 'Profile retrieved successfully',
                      },
                      data: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 102 },
                          firstName: { type: 'string', example: 'John' },
                          lastName: { type: 'string', example: 'Doe' },
                          email: {
                            type: 'string',
                            example: 'john.doe@example.com',
                          },
                          avatarUrl: {
                            type: 'string',
                            example:
                              'https://res.cloudinary.com/demo/image/upload/avatar.jpg',
                          },
                          role: { type: 'string', example: 'USER' },
                          followersCount: { type: 'integer', example: 6 },
                          followingsCount: { type: 'integer', example: 7 },
                          isFollowing: {
                            type: 'boolean',
                            example: false,
                            description: 'Mặc định false đối với chính chủ',
                          },
                          _count: {
                            type: 'object',
                            properties: {
                              photos: { type: 'integer', example: 4 },
                              albums: { type: 'integer', example: 1 },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: 'Yêu cầu đăng nhập.' },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['User Profile'],
          summary:
            'Lấy thông tin profile và các chỉ số thống kê của một người dùng khác [Hỗ trợ Guest & User]',
          security: [{}, { BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của người dùng cần xem thông tin',
            },
          ],
          responses: {
            200: {
              description: 'Trả về thông tin người dùng thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: {
                        type: 'string',
                        example: 'User profile retrieved successfully',
                      },
                      data: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 102 },
                          firstName: {
                            type: 'string',
                            example: 'UserFirstName_27',
                          },
                          lastName: {
                            type: 'string',
                            example: 'UserLastName_27',
                          },
                          email: {
                            type: 'string',
                            example: 'user.27@example.com',
                          },
                          avatarUrl: {
                            type: 'string',
                            example: 'https://i.pravatar.cc/150?img=27',
                          },
                          role: { type: 'string', example: 'USER' },
                          followersCount: { type: 'integer', example: 6 },
                          followingsCount: { type: 'integer', example: 7 },
                          isFollowing: {
                            type: 'boolean',
                            example: true,
                            description:
                              'Trạng thái người dùng hiện tại có đang theo dõi target user này không',
                          },
                          _count: {
                            type: 'object',
                            properties: {
                              photos: { type: 'integer', example: 4 },
                              albums: { type: 'integer', example: 1 },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: { description: 'Không tìm thấy người dùng.' },
          },
        },
      },
      '/users/profile': {
        put: {
          tags: ['User Profile'],
          summary: 'Người dùng tự cập nhật thông tin hồ sơ cá nhân',
          description:
            'Yêu cầu điền mật khẩu hiện tại (oldPassword) để xác thực nếu muốn cập nhật mật khẩu mới.',
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    firstName: { type: 'string', example: 'Nguyễn' },
                    lastName: { type: 'string', example: 'An' },
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'an.nguyen@example.com',
                    },
                    oldPassword: {
                      type: 'string',
                      description:
                        'Mật khẩu hiện tại (Bắt buộc phải nhập chính xác nếu muốn thay đổi mật khẩu mới)',
                      example: 'oldsecure123',
                    },
                    password: {
                      type: 'string',
                      description:
                        'Mật khẩu mới muốn thay đổi. Để trống nếu giữ nguyên mật khẩu cũ.',
                      example: 'newsecure456',
                    },
                    avatar: {
                      type: 'string',
                      format: 'binary',
                      description:
                        'Tải tệp tin hình ảnh đại diện (avatar) mới lên hệ thống',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Cập nhật hồ sơ cá nhân thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: {
                        type: 'string',
                        example: 'Profile updated successfully',
                      },
                      data: { type: 'object' },
                    },
                  },
                },
              },
            },
            400: {
              description:
                'Mật khẩu cũ không chính xác hoặc email đã được sử dụng.',
            },
            401: { description: 'Yêu cầu đăng nhập.' },
          },
        },
      },
      '/users/account': {
        delete: {
          tags: ['User Profile'],
          summary: 'Người dùng tự xóa vĩnh viễn tài khoản cá nhân',
          security: [{ BearerAuth: [] }],
          responses: {
            200: { description: 'Xóa tài khoản cá nhân thành công.' },
            401: { description: 'Yêu cầu đăng nhập.' },
          },
        },
      },
      '/users/my-followers': {
        get: {
          tags: ['User Connections'],
          summary: 'Xem danh sách những người đang theo dõi TÔI',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Trả về danh sách người theo dõi thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            avatarUrl: { type: 'string', nullable: true },
                            photosCount: {
                              type: 'integer',
                              description:
                                'Số lượng ảnh công khai của user này',
                            },
                            albumsCount: {
                              type: 'integer',
                              description:
                                'Số lượng album công khai của user này',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/users/my-following': {
        get: {
          tags: ['User Connections'],
          summary: 'Xem danh sách những người TÔI đang theo dõi',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Trả về danh sách đang theo dõi thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            avatarUrl: { type: 'string', nullable: true },
                            photosCount: { type: 'integer' },
                            albumsCount: { type: 'integer' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // ==================== OTHER USER CONNECTIONS (USER BẤT KỲ QUA ID) ====================
      '/users/{id}/followers': {
        get: {
          tags: ['User Connections'],
          summary: 'Xem danh sách những người đang theo dõi một User bất kỳ',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của người dùng cần xem danh sách followers',
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Trả về danh sách followers thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            avatarUrl: { type: 'string', nullable: true },
                            photosCount: { type: 'integer' },
                            albumsCount: { type: 'integer' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: { description: 'Không tìm thấy người dùng.' },
          },
        },
      },
      '/users/{id}/following': {
        get: {
          tags: ['User Connections'],
          summary: 'Xem danh sách những người một User bất kỳ đang theo dõi',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của người dùng cần xem danh sách following',
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
            },
          ],
          responses: {
            200: {
              description: 'Trả về danh sách following thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            firstName: { type: 'string' },
                            lastName: { type: 'string' },
                            avatarUrl: { type: 'string', nullable: true },
                            photosCount: { type: 'integer' },
                            albumsCount: { type: 'integer' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: { description: 'Không tìm thấy người dùng.' },
          },
        },
      },
      /* ---------------- MODULE PHOTO ---------------- */
      '/photos/discovery_photos': {
        get: {
          tags: ['Photos'],
          summary: 'Khám phá hình ảnh công khai toàn hệ thống (Phân trang)',
          security: [{ BearerAuth: [] }],
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
            200: {
              description: 'Lấy danh sách hình ảnh khám phá thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      photos: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            sharingMode: { type: 'string' },
                            likesCount: { type: 'integer' },
                            isLiked: {
                              type: 'boolean',
                              description:
                                'Trạng thái đã thích của user hiện tại',
                            },
                            createdAt: { type: 'string', format: 'date-time' },
                            media: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer' },
                                imageUrl: { type: 'string' },
                              },
                            },
                            user: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer' },
                                firstName: { type: 'string' },
                                lastName: { type: 'string' },
                                avatarUrl: { type: 'string', nullable: true },
                                isFollowing: {
                                  type: 'boolean',
                                  description:
                                    'True nếu người dùng hiện tại đang theo dõi tác giả này. Luôn False nếu là Guest hoặc chính tác giả.',
                                },
                              },
                            },
                          },
                        },
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          totalPages: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
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
            200: {
              description: 'Lấy danh sách feed ảnh thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      photos: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            sharingMode: { type: 'string' },
                            likesCount: { type: 'integer' },
                            isLiked: {
                              type: 'boolean',
                              description:
                                'Trạng thái đã thích của user hiện tại',
                            },
                            createdAt: { type: 'string', format: 'date-time' },
                            media: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer' },
                                imageUrl: { type: 'string' },
                              },
                            },
                            user: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer' },
                                firstName: { type: 'string' },
                                lastName: { type: 'string' },
                                avatarUrl: { type: 'string', nullable: true },
                                isFollowing: {
                                  type: 'boolean',
                                  description:
                                    'True nếu người dùng hiện tại đang theo dõi tác giả này.',
                                },
                              },
                            },
                          },
                        },
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          totalPages: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
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
      '/photos/user/{userId}': {
        get: {
          tags: ['Photos'],
          summary: 'Lấy danh sách hình ảnh của một người dùng bất kỳ theo ID',
          description:
            'Hệ thống tự động so sánh ID: Nếu là chính chủ xem thì trả về tất cả ảnh (PUBLIC + PRIVATE). Nếu người khác xem thì chỉ trả về ảnh trạng thái PUBLIC.',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'userId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của người dùng cần xem danh sách ảnh',
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Số trang cần lấy',
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 12 },
              description: 'Số lượng ảnh hiển thị trên mỗi trang',
            },
          ],
          responses: {
            200: {
              description:
                'Trả về danh sách hình ảnh và thông tin phân trang thành công.',
            },
            400: { description: 'ID người dùng truyền vào không hợp lệ.' },
            401: { description: 'Yêu cầu đăng nhập (Thiếu Bearer Token).' },
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
        get: {
          tags: ['Photos'],
          summary:
            'Lấy thông tin chi tiết hình ảnh theo ID phục vụ cho chỉnh sửa (Edit)',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của Photo cần lấy chi tiết',
            },
          ],
          responses: {
            200: {
              description: 'Lấy chi tiết hình ảnh thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      title: { type: 'string' },
                      description: { type: 'string' },
                      sharingMode: { type: 'string' },
                      createdAt: { type: 'string', format: 'date-time' },
                      media: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          imageUrl: { type: 'string' },
                        },
                      },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          firstName: { type: 'string' },
                          lastName: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
            403: { description: 'Không có quyền xem hình ảnh riêng tư này.' },
            404: { description: 'Không tìm thấy hình ảnh.' },
          },
        },
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
      /* ---------------- MODULE ALBUM ---------------- */
      '/albums/discovery_albums': {
        get: {
          tags: ['Albums'],
          summary: 'Khám phá album công khai toàn hệ thống (Phân trang)',
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
            200: {
              description: 'Lấy danh sách album thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      albums: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            sharingMode: { type: 'string' },
                            likesCount: { type: 'integer' },
                            isLiked: { type: 'boolean' },
                            createdAt: { type: 'string', format: 'date-time' },
                            albumMedias: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  position: { type: 'integer' },
                                  media: {
                                    type: 'object',
                                    properties: {
                                      id: { type: 'integer' },
                                      imageUrl: { type: 'string' },
                                    },
                                  },
                                },
                              },
                            },
                            user: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer' },
                                firstName: { type: 'string' },
                                lastName: { type: 'string' },
                                avatarUrl: { type: 'string', nullable: true },
                                isFollowing: {
                                  type: 'boolean',
                                  description:
                                    'True nếu người dùng hiện tại đang theo dõi tác giả của album này. Luôn False nếu là Guest hoặc chính tác giả.',
                                },
                              },
                            },
                          },
                        },
                      },
                      meta: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          totalPages: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
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
          responses: {
            200: {
              description: 'Lấy feed album thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      albums: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'integer' },
                            title: { type: 'string' },
                            description: { type: 'string' },
                            sharingMode: { type: 'string' },
                            likesCount: { type: 'integer' },
                            isLiked: { type: 'boolean' },
                            createdAt: { type: 'string', format: 'date-time' },
                            albumMedias: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  position: { type: 'integer' },
                                  media: {
                                    type: 'object',
                                    properties: {
                                      id: { type: 'integer' },
                                      imageUrl: { type: 'string' },
                                    },
                                  },
                                },
                              },
                            },
                            user: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer' },
                                firstName: { type: 'string' },
                                lastName: { type: 'string' },
                                avatarUrl: { type: 'string', nullable: true },
                                isFollowing: {
                                  type: 'boolean',
                                  description:
                                    'True nếu đang theo dõi tác giả của album này.',
                                },
                              },
                            },
                          },
                        },
                      },
                      meta: {
                        type: 'object',
                        properties: {
                          page: { type: 'integer' },
                          limit: { type: 'integer' },
                          total: { type: 'integer' },
                          totalPages: { type: 'integer' },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: 'Chưa đăng nhập hoặc token hết hạn.' },
          },
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
      '/albums/user/{userId}': {
        get: {
          tags: ['Albums'],
          summary: 'Lấy danh sách Album của một người dùng bất kỳ theo ID',
          description:
            'Hệ thống tự động kiểm tra quyền sở hữu: Nếu là chính chủ xem thì trả về tất cả album bao gồm cả PRIVATE. Nếu người khác xem thì chỉ hiển thị những bộ sưu tập ở trạng thái PUBLIC.',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'userId',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của người dùng cần xem danh sách Album',
            },
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
            200: {
              description:
                'Trả về danh sách bộ sưu tập và siêu dữ liệu phân trang thành công.',
            },
            400: { description: 'ID người dùng không hợp lệ.' },
            401: { description: 'Yêu cầu đăng nhập (Thiếu Bearer Token).' },
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
        get: {
          tags: ['Albums'],
          summary:
            'Lấy thông tin chi tiết Album theo ID phục vụ cho chỉnh sửa (Edit)',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của Album cần lấy chi tiết',
            },
          ],
          responses: {
            200: {
              description: 'Lấy chi tiết album thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      title: { type: 'string' },
                      description: { type: 'string' },
                      sharingMode: { type: 'string' },
                      createdAt: { type: 'string', format: 'date-time' },
                      albumMedias: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            position: { type: 'integer' },
                            media: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer' },
                                imageUrl: { type: 'string' },
                              },
                            },
                          },
                        },
                      },
                      user: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          firstName: { type: 'string' },
                          lastName: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: { description: 'Không tìm thấy album.' },
          },
        },
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
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    images: {
                      type: 'array',
                      description:
                        'Chọn thêm các file ảnh mới muốn bổ sung vào album (Tối đa 25 ảnh, < 5MB/ảnh)',
                      items: {
                        type: 'string',
                        format: 'binary',
                      },
                    },
                    title: {
                      type: 'string',
                      description: 'Tiêu đề album mới (Tối đa 140 ký tự)',
                    },
                    description: {
                      type: 'string',
                      description:
                        'Mô tả chi tiết album mới (Tối đa 300 ký tự)',
                    },
                    sharingMode: {
                      type: 'string',
                      enum: ['PUBLIC', 'PRIVATE'],
                      description:
                        'Chế độ hiển thị của Album (PUBLIC hoặc PRIVATE)',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Cập nhật Album thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      data: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          title: { type: 'string' },
                          description: { type: 'string' },
                          sharingMode: { type: 'string' },
                          albumMedias: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                position: { type: 'integer' },
                                media: {
                                  type: 'object',
                                  properties: {
                                    id: { type: 'integer' },
                                    imageUrl: { type: 'string' },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            403: { description: 'Bạn không có quyền chỉnh sửa album này.' },
            404: { description: 'Không tìm thấy Album tương ứng.' },
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
      '/admin/users': {
        get: {
          tags: ['Admin Management'],
          summary:
            'Lấy toàn bộ danh sách người dùng trong hệ thống (Phân trang động)',
          security: [{ BearerAuth: [] }],
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
              description: 'Số lượng item cần lấy trong 1 trang (Cụm tải BE)',
            },
          ],
          responses: {
            200: {
              description: 'Lấy danh sách thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          users: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer' },
                                firstName: { type: 'string' },
                                lastName: { type: 'string' },
                                email: { type: 'string' },
                                role: { type: 'string' },
                                isActive: { type: 'boolean' },
                                createdAt: {
                                  type: 'string',
                                  format: 'date-time',
                                },
                                photosCount: { type: 'integer' },
                                albumsCount: { type: 'integer' },
                              },
                            },
                          },
                          meta: {
                            type: 'object',
                            properties: {
                              total: { type: 'integer' },
                              page: { type: 'integer' },
                              limit: { type: 'integer' },
                              totalPages: { type: 'integer' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/admin/photos': {
        get: {
          tags: ['Admin Management'],
          summary: 'Kiểm soát toàn bộ hình ảnh hệ thống (Phân trang động)',
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
            200: {
              description: 'Lấy danh sách ảnh thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          photos: { type: 'array', items: { type: 'object' } },
                          meta: {
                            type: 'object',
                            properties: {
                              total: { type: 'integer' },
                              page: { type: 'integer' },
                              limit: { type: 'integer' },
                              totalPages: { type: 'integer' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/admin/albums': {
        get: {
          tags: ['Admin Management'],
          summary: 'Kiểm soát toàn bộ album hệ thống (Phân trang động)',
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
            200: {
              description: 'Lấy danh sách album thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          albums: { type: 'array', items: { type: 'object' } },
                          meta: {
                            type: 'object',
                            properties: {
                              total: { type: 'integer' },
                              page: { type: 'integer' },
                              limit: { type: 'integer' },
                              totalPages: { type: 'integer' },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/admin/photos/{id}': {
        get: {
          tags: ['Admin Management'],
          summary:
            'Lấy thông tin chi tiết một bức ảnh (Bao gồm cả ảnh ẩn PRIVATE của User) [Quyền ADMIN]',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID bức ảnh cần lấy',
            },
          ],
          responses: {
            200: {
              description: 'Lấy chi tiết ảnh thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: {
                        type: 'string',
                        example:
                          'Photo details retrieved successfully by Admin',
                      },
                      data: { type: 'object' },
                    },
                  },
                },
              },
            },
            403: { description: 'Yêu cầu đặc quyền Admin.' },
            404: { description: 'Không tìm thấy hình ảnh.' },
          },
        },
        put: {
          tags: ['Admin Management'],
          summary:
            'Admin chỉnh sửa thông tin hoặc ghi đè hình ảnh của bất kỳ bài đăng nào [Quyền ADMIN]',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của bức ảnh cần chỉnh sửa',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                      description: 'Tiêu đề mới của bức ảnh (Tối đa 140 ký tự)',
                    },
                    description: {
                      type: 'string',
                      description: 'Mô tả mới của bức ảnh (Tối đa 300 ký tự)',
                    },
                    sharingMode: {
                      type: 'string',
                      enum: ['PUBLIC', 'PRIVATE'],
                      description: 'Chế độ hiển thị mới',
                    },
                    photo: {
                      type: 'string',
                      format: 'binary',
                      description:
                        'File ảnh mới tải lên để ghi đè (Tối đa 5MB)',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Admin cập nhật hình ảnh thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      data: {
                        type: 'object',
                        description: 'Thông tin bức ảnh sau khi cập nhật',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Dữ liệu đầu vào không hợp lệ hoặc sai định dạng.',
            },
            401: { description: 'Chưa đăng nhập (Thiếu Token).' },
            403: { description: 'Từ chối truy cập - Yêu cầu đặc quyền Admin.' },
            404: { description: 'Không tìm thấy hình ảnh yêu cầu.' },
          },
        },
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
      '/admin/albums/{id}': {
        get: {
          tags: ['Admin Management'],
          summary:
            'Lấy cấu trúc chi tiết một Album (Bao gồm cả Album ẩn PRIVATE của User) [Quyền ADMIN]',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID Album cần lấy',
            },
          ],
          responses: {
            200: {
              description: 'Lấy chi tiết Album thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: {
                        type: 'string',
                        example:
                          'Album details retrieved successfully by Admin',
                      },
                      data: { type: 'object' },
                    },
                  },
                },
              },
            },
            403: { description: 'Yêu cầu đặc quyền Admin.' },
            404: { description: 'Không tìm thấy Album.' },
          },
        },
        put: {
          tags: ['Admin Management'],
          summary:
            'Admin chỉnh sửa thông tin, xóa ảnh cũ hoặc bổ sung ảnh mới vào Album của bất kỳ ai [Quyền ADMIN]',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của Album cần cập nhật',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                      description: 'Tiêu đề mới của Album',
                    },
                    description: {
                      type: 'string',
                      description: 'Mô tả mới của Album',
                    },
                    sharingMode: {
                      type: 'string',
                      enum: ['PUBLIC', 'PRIVATE'],
                      description: 'Chế độ hiển thị của Album',
                    },
                    remainingImages: {
                      type: 'string',
                      example: '[102, 105]',
                      description:
                        'Chuỗi JSON mảng chứa ID các hình ảnh CŨ muốn GIỮ LẠI trong Album. Những ID ảnh cũ nào không nằm trong chuỗi này sẽ tự động bị xóa sạch khỏi DB và Cloudinary.',
                    },
                    images: {
                      type: 'array',
                      items: { type: 'string', format: 'binary' },
                      description:
                        'Mảng các file ảnh mới muốn tải lên và bổ sung thêm vào Album (Tối đa 25 ảnh)',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Admin cập nhật Album thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      message: {
                        type: 'string',
                        example: 'Album updated by Admin successfully',
                      },
                      data: {
                        type: 'object',
                        description:
                          'Thông tin Album và danh sách ảnh hoàn chỉnh sau khi xử lý',
                      },
                    },
                  },
                },
              },
            },
            400: {
              description:
                'Lỗi cú pháp parse JSON hoặc vượt quá giới hạn file.',
            },
            401: { description: 'Chưa đăng nhập.' },
            403: { description: 'Từ chối truy cập - Yêu cầu đặc quyền Admin.' },
            404: { description: 'Không tìm thấy Album yêu cầu.' },
          },
        },
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
        get: {
          tags: ['Admin Management'],
          summary:
            'Lấy thông tin chi tiết của một người dùng phục vụ trang chỉnh sửa [Quyền ADMIN]',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID của người dùng cần lấy thông tin cấu hình',
            },
          ],
          responses: {
            200: {
              description: 'Lấy thông tin chi tiết người dùng thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: {
                        type: 'string',
                        example: 'User details retrieved successfully',
                      },
                      data: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer', example: 111 },
                          firstName: { type: 'string', example: 'Khôi' },
                          lastName: { type: 'string', example: 'Đăng' },
                          email: { type: 'string', example: '6@example.com' },
                          avatarUrl: {
                            type: 'string',
                            nullable: true,
                            example: 'https://...',
                          },
                          role: { type: 'string', example: 'USER' },
                          isActive: { type: 'boolean', example: true },
                          lastLogin: {
                            type: 'string',
                            format: 'date-time',
                            nullable: true,
                          },
                          createdAt: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: 'Chưa đăng nhập (Thiếu Token).',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      error: {
                        type: 'string',
                        example: 'Authentication required.',
                      },
                    },
                  },
                },
              },
            },
            403: {
              description: 'Từ chối truy cập - Yêu cầu đặc quyền ADMIN.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      error: {
                        type: 'string',
                        example: 'Access denied. Admins only.',
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: 'Không tìm thấy người dùng hệ thống.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: false },
                      error: { type: 'string', example: 'User not found.' },
                    },
                  },
                },
              },
            },
          },
        },
        patch: {
          tags: ['Admin Management'],
          summary:
            'Thay đổi trạng thái hoạt động (Khóa/Mở khóa) của một tài khoản người dùng',
          description:
            'Hệ thống tự động biên dịch mẫu thông báo để chuẩn bị gửi cảnh báo email cho User.',
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
            200: {
              description: 'Cập nhật trạng thái tài khoản thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: {
                        type: 'string',
                        example:
                          'User account has been successfully suspended.',
                      },
                      data: { type: 'object' },
                    },
                  },
                },
              },
            },
            400: {
              description:
                'Tham số không hợp lệ hoặc cố tình tác động tài khoản Admin khác.',
            },
            404: { description: 'Không tìm thấy người dùng.' },
          },
        },
        put: {
          tags: ['Admin Management'],
          summary:
            'Admin chỉnh sửa thông tin hồ sơ của bất kỳ người dùng nào [Quyền ADMIN]',
          description:
            'Cho phép Admin cập nhật thông tin và đặt mật khẩu mới trực tiếp mà không cần cung cấp mật khẩu cũ của người dùng. hỗ trợ upload tệp tin avatar lên Cloudinary.',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID người dùng cần sửa đổi',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    firstName: { type: 'string', example: 'Dang Updated' },
                    lastName: { type: 'string', example: 'Khoi' },
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'updated.email@example.com',
                    },
                    password: {
                      type: 'string',
                      description:
                        'Mật khẩu mới gán cho User. Để trống hoặc chuỗi rỗng nếu giữ nguyên mật khẩu cũ.',
                      example: 'newsecurepassword123',
                    },
                    avatar: {
                      type: 'string',
                      format: 'binary',
                      description:
                        'Tải tập tin hình ảnh avatar mới lên thay thế cho người dùng',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Admin cập nhật thông tin người dùng thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: {
                        type: 'string',
                        example: 'User profile updated successfully by Admin',
                      },
                      data: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          firstName: { type: 'string' },
                          lastName: { type: 'string' },
                          email: { type: 'string' },
                          role: { type: 'string' },
                          avatarUrl: { type: 'string', nullable: true },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description:
                'Dữ liệu đầu vào hoặc định dạng Email không hợp lệ / Email đã tồn tại.',
            },
            401: { description: 'Yêu cầu đăng nhập.' },
            403: { description: 'Từ chối truy cập: Bạn không phải Admin.' },
            404: { description: 'Không tìm thấy người dùng.' },
          },
        },
        delete: {
          tags: ['Admin Management'],
          summary:
            'Admin xóa vĩnh viễn một tài khoản và tự động gửi email thông báo gỡ bỏ',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
              description: 'ID tài khoản cần xóa bỏ hoàn toàn khỏi hệ thống',
            },
          ],
          responses: {
            200: {
              description:
                'Xóa tài khoản thành công và email thông báo đã được gửi.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: {
                        type: 'string',
                        example:
                          'User account has been permanently removed by Admin.',
                      },
                    },
                  },
                },
              },
            },
            401: { description: 'Yêu cầu đăng nhập.' },
            403: {
              description:
                'Từ chối truy cập: Không thể tự xóa chính mình hoặc bạn không phải Admin.',
            },
            404: { description: 'Không tìm thấy người dùng.' },
          },
        },
      },
      /* ---------------- MODULE SEARCH ---------------- */
      '/search': {
        get: {
          tags: ['Global Features'],
          summary:
            'Tìm kiếm toàn cục theo từ khóa cho Photo và Album [Hỗ trợ Guest & User]',
          description:
            'Kết quả tự động phân thành 2 nhóm độc lập công khai. Trả về trạng thái tương tác isLiked và isFollowing tương ứng với người dùng hiện tại.',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'q',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Từ khóa tìm kiếm (Khớp theo tiêu đề hoặc mô tả)',
            },
          ],
          responses: {
            200: {
              description: 'Thực hiện tìm kiếm thành công.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: {
                        type: 'string',
                        example: 'Search operations executed successfully.',
                      },
                      data: {
                        type: 'object',
                        properties: {
                          photos: {
                            type: 'array',
                            description: 'Danh sách các bức ảnh phù hợp',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer', example: 12 },
                                title: {
                                  type: 'string',
                                  example: 'Sunset in Hoi An',
                                },
                                description: {
                                  type: 'string',
                                  example: 'Beautiful sunset view',
                                },
                                sharingMode: {
                                  type: 'string',
                                  example: 'PUBLIC',
                                },
                                likesCount: { type: 'integer', example: 5 },
                                createdAt: {
                                  type: 'string',
                                  format: 'date-time',
                                },
                                updatedAt: {
                                  type: 'string',
                                  format: 'date-time',
                                },
                                userId: { type: 'integer', example: 33 },
                                isLiked: { type: 'boolean', example: true },
                                media: {
                                  type: 'object',
                                  properties: {
                                    imageUrl: {
                                      type: 'string',
                                      example:
                                        'https://res.cloudinary.com/demo/image/upload/sample.jpg',
                                    },
                                  },
                                },
                                user: {
                                  type: 'object',
                                  properties: {
                                    id: { type: 'integer', example: 33 },
                                    firstName: {
                                      type: 'string',
                                      example: 'John',
                                    },
                                    lastName: {
                                      type: 'string',
                                      example: 'Doe',
                                    },
                                    avatarUrl: {
                                      type: 'string',
                                      example:
                                        'https://res.cloudinary.com/demo/image/upload/avatar.jpg',
                                    },
                                    isFollowing: {
                                      type: 'boolean',
                                      example: false,
                                    },
                                  },
                                },
                              },
                            },
                          },
                          albums: {
                            type: 'array',
                            description: 'Danh sách các Album phù hợp',
                            items: {
                              type: 'object',
                              properties: {
                                id: { type: 'integer', example: 5 },
                                title: {
                                  type: 'string',
                                  example: 'Summer Vacation 2026',
                                },
                                description: {
                                  type: 'string',
                                  example: 'Trip to Da Nang',
                                },
                                sharingMode: {
                                  type: 'string',
                                  example: 'PUBLIC',
                                },
                                likesCount: { type: 'integer', example: 10 },
                                createdAt: {
                                  type: 'string',
                                  format: 'date-time',
                                },
                                updatedAt: {
                                  type: 'string',
                                  format: 'date-time',
                                },
                                userId: { type: 'integer', example: 33 },
                                isLiked: { type: 'boolean', example: false },
                                albumMedias: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    properties: {
                                      id: { type: 'integer', example: 1 },
                                      albumId: { type: 'integer', example: 5 },
                                      mediaId: { type: 'integer', example: 20 },
                                      position: { type: 'integer', example: 0 },
                                      media: {
                                        type: 'object',
                                        properties: {
                                          id: { type: 'integer', example: 20 },
                                          imageUrl: {
                                            type: 'string',
                                            example:
                                              'https://res.cloudinary.com/demo/image/upload/album1.jpg',
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                                user: {
                                  type: 'object',
                                  properties: {
                                    id: { type: 'integer', example: 33 },
                                    firstName: {
                                      type: 'string',
                                      example: 'John',
                                    },
                                    lastName: {
                                      type: 'string',
                                      example: 'Doe',
                                    },
                                    avatarUrl: {
                                      type: 'string',
                                      example:
                                        'https://res.cloudinary.com/demo/image/upload/avatar.jpg',
                                    },
                                    isFollowing: {
                                      type: 'boolean',
                                      example: true,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
