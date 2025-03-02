import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { User } from '../user/domain/model/user';
import { Logger } from '@nestjs/common';

@Injectable()
export class ApisixService {
  private readonly logger: Logger = new Logger('ApisixService');
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
  async registerConsumer(user: User): Promise<void> {
    const consumerConfig = {
      username: user.id, // Identificador único del consumidor
      plugins: {
        'jwt-auth': {
          key: user.email, // Clave del consumidor (el email)
          secret: process.env.JWT_SECRET, // Secreto del consumidor (el email)
        },
      },
    };

    try {
      this.logger.log('Url Admin:' + this.apisixAdminUrl);
      await axios.put(
        `${this.apisixAdminUrl}/consumers/`, // Registra al consumidor con su email
        consumerConfig,
        {
          headers: {
            'X-API-KEY': this.apisixAdminKey,
          },
        },
      );
      this.logger.log(`Consumer ${user.email} registered successfully in APISIX`);
    } catch (error) {
      this.logger.error(
        'Error registering consumer in APISIX:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to register consumer in APISIX',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteConsumer(userId: string): Promise<void> {
    try {
      this.logger.log('Url Admin:' + this.apisixAdminUrl);
      
      // Envía una solicitud DELETE al endpoint de APISIX para eliminar al consumidor
      await axios.delete(
        `${this.apisixAdminUrl}/consumers/${userId}`,
        {
          headers: {
            'X-API-KEY': this.apisixAdminKey,
          },
        },
      );
  
      this.logger.log('Consumer ${userId} deleted successfully from APISIX');
    } catch (error) {
      this.logger.error(
        'Error deleting consumer in APISIX:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to delete consumer in APISIX',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
