import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ApisixService {
  private readonly apisixAdminUrl: string;
  private readonly apisixAdminKey: string; // Reemplaza con tu clave administrativa de APISIX

  constructor(private configService: ConfigService) {
    (this.apisixAdminUrl = configService.get('APISIX_URL')),
      (this.apisixAdminKey = configService.get('APISIX_ADMIN_KEY'));
  }
  /**
   * Registrar un consumidor en APISIX
   * @param email Email del usuario (usado como key y secret)
   */
  async registerConsumer(email: string, password: string): Promise<void> {
    const sanitizedUsername = email.split('@')[0];
    const consumerConfig = {
      username: sanitizedUsername, // Identificador único del consumidor
      plugins: {
        'jwt-auth': {
          key: email, // Clave del consumidor (el email)
          secret: password, // Secreto del consumidor (el email)
        },
      },
    };

    try {
      console.log('Url Admin:' + this.apisixAdminUrl);
      await axios.put(
        `${this.apisixAdminUrl}/consumers/`, // Registra al consumidor con su email
        consumerConfig,
        {
          headers: {
            'X-API-KEY': this.apisixAdminKey,
          },
        },
      );
      console.log(`Consumer ${email} registered successfully in APISIX`);
    } catch (error) {
      console.error(
        'Error registering consumer in APISIX:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to register consumer in APISIX',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Configurar una ruta protegida global en APISIX
   * Protege todas las rutas bajo `/api/*` y valida tokens JWT
   */
  async createGlobalProtectedRoute(): Promise<void> {
    const routeConfig = {
      uri: '/api/*', // Protege todas las rutas que comiencen con /api/
      plugins: {
        'jwt-auth': {}, // Habilita la validación JWT
      },
      upstream: {
        type: 'roundrobin',
        nodes: {
          '127.0.0.1:3000': 1, // Backend NestJS
        },
      },
    };

    try {
      await axios.put(
        `${this.apisixAdminUrl}/routes/global-protected-route`, // ID único de la ruta
        routeConfig,
        {
          headers: {
            'X-API-KEY': this.apisixAdminKey,
          },
        },
      );
      console.log('Global protected route created successfully in APISIX');
    } catch (error) {
      console.error(
        'Error creating global protected route in APISIX:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to create global protected route in APISIX',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
