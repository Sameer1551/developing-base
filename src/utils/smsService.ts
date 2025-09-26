/**
 * SMS Service Utility
 * 
 * This service provides a centralized way to send SMS notifications.
 * Currently simulates SMS sending, but can be easily integrated with real SMS APIs.
 * 
 * Supported SMS providers that can be integrated:
 * - Twilio
 * - AWS SNS
 * - MSG91 (India)
 * - TextLocal (India)
 * - Fast2SMS (India)
 */

export interface SMSMessage {
  to: string;
  message: string;
  priority?: 'high' | 'normal' | 'low';
  template?: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
}

export interface SMSConfig {
  provider: 'twilio' | 'aws-sns' | 'msg91' | 'textlocal' | 'fast2sms' | 'mock';
  apiKey?: string;
  apiSecret?: string;
  from?: string;
  templateId?: string;
}

class SMSService {
  private config: SMSConfig;

  constructor(config: SMSConfig = { provider: 'mock' }) {
    this.config = config;
  }

  /**
   * Send a single SMS message
   */
  async sendSMS(smsMessage: SMSMessage): Promise<SMSResponse> {
    try {
      switch (this.config.provider) {
        case 'mock':
          return this.sendMockSMS(smsMessage);
        case 'twilio':
          return this.sendTwilioSMS(smsMessage);
        case 'aws-sns':
          return this.sendAWSSNS(smsMessage);
        case 'msg91':
          return this.sendMSG91SMS(smsMessage);
        case 'textlocal':
          return this.sendTextLocalSMS(smsMessage);
        case 'fast2sms':
          return this.sendFast2SMSSMS(smsMessage);
        default:
          throw new Error(`Unsupported SMS provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error('SMS sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send multiple SMS messages in batch
   */
  async sendBulkSMS(messages: SMSMessage[]): Promise<SMSResponse[]> {
    const results: SMSResponse[] = [];
    
    for (const message of messages) {
      const result = await this.sendSMS(message);
      results.push(result);
      
      // Add small delay between messages to avoid rate limiting
      if (this.config.provider !== 'mock') {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }

  /**
   * Send SMS to health workers for alerts
   */
  async sendAlertSMS(
    phoneNumbers: string[], 
    alertData: {
      title: string;
      type: string;
      priority: string;
      district: string;
      description: string;
    }
  ): Promise<SMSResponse[]> {
    const messages: SMSMessage[] = phoneNumbers.map(phone => ({
      to: phone,
      message: this.formatAlertMessage(alertData),
      priority: 'high'
    }));

    return this.sendBulkSMS(messages);
  }

  /**
   * Format alert message for SMS
   */
  private formatAlertMessage(alertData: {
    title: string;
    type: string;
    priority: string;
    district: string;
    description: string;
  }): string {
    const priorityEmoji = {
      'Critical': '🚨',
      'High': '⚠️',
      'Medium': '📢',
      'Low': 'ℹ️'
    };

    const typeEmoji = {
      'Health Emergency': '🏥',
      'Water Quality': '💧',
      'Disease Outbreak': '🦠',
      'Infrastructure': '🏗️',
      'Weather': '🌦️'
    };

    return `${priorityEmoji[alertData.priority as keyof typeof priorityEmoji] || '🚨'} ALERT: ${alertData.title}

${typeEmoji[alertData.type as keyof typeof typeEmoji] || '📢'} Type: ${alertData.type}
📍 District: ${alertData.district}
⚡ Priority: ${alertData.priority}

${alertData.description}

Please take immediate action.

- NE HealthNet System`;
  }

  /**
   * Mock SMS sending (for development/testing)
   */
  private async sendMockSMS(smsMessage: SMSMessage): Promise<SMSResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate occasional failures (5% failure rate)
    if (Math.random() < 0.05) {
      return {
        success: false,
        error: 'Mock SMS failure simulation'
      };
    }

    console.log(`[MOCK SMS] Sent to ${smsMessage.to}:`, smsMessage.message);
    
    return {
      success: true,
      messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      cost: 0.01
    };
  }

  /**
   * Twilio SMS integration
   */
  private async sendTwilioSMS(smsMessage: SMSMessage): Promise<SMSResponse> {
    if (!this.config.apiKey || !this.config.apiSecret) {
      throw new Error('Twilio API credentials not configured');
    }

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.config.apiKey}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${this.config.apiKey}:${this.config.apiSecret}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: smsMessage.to,
        From: this.config.from || '+1234567890',
        Body: smsMessage.message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Twilio SMS failed');
    }

    return {
      success: true,
      messageId: data.sid,
      cost: parseFloat(data.price || '0')
    };
  }

  /**
   * AWS SNS SMS integration
   */
  private async sendAWSSNS(): Promise<SMSResponse> {
    if (!this.config.apiKey || !this.config.apiSecret) {
      throw new Error('AWS credentials not configured');
    }

    // This would require AWS SDK integration
    // For now, return a placeholder implementation
    throw new Error('AWS SNS integration not implemented yet');
  }

  /**
   * MSG91 SMS integration (India)
   */
  private async sendMSG91SMS(smsMessage: SMSMessage): Promise<SMSResponse> {
    if (!this.config.apiKey) {
      throw new Error('MSG91 API key not configured');
    }

    const response = await fetch('https://api.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': this.config.apiKey,
      },
      body: JSON.stringify({
        flow_id: this.config.templateId,
        mobiles: smsMessage.to,
        VAR1: smsMessage.message,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.type !== 'success') {
      throw new Error(data.message || 'MSG91 SMS failed');
    }

    return {
      success: true,
      messageId: data.request_id,
      cost: parseFloat(data.cost || '0')
    };
  }

  /**
   * TextLocal SMS integration (India)
   */
  private async sendTextLocalSMS(smsMessage: SMSMessage): Promise<SMSResponse> {
    if (!this.config.apiKey) {
      throw new Error('TextLocal API key not configured');
    }

    const response = await fetch('https://api.textlocal.in/send/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        apikey: this.config.apiKey,
        numbers: smsMessage.to,
        message: smsMessage.message,
        sender: this.config.from || 'TXTLCL',
      }),
    });

    const data = await response.json();

    if (!response.ok || data.status !== 'success') {
      throw new Error(data.message || 'TextLocal SMS failed');
    }

    return {
      success: true,
      messageId: data.message_id,
      cost: parseFloat(data.cost || '0')
    };
  }

  /**
   * Fast2SMS SMS integration (India)
   */
  private async sendFast2SMSSMS(smsMessage: SMSMessage): Promise<SMSResponse> {
    if (!this.config.apiKey) {
      throw new Error('Fast2SMS API key not configured');
    }

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'authorization': this.config.apiKey,
      },
      body: new URLSearchParams({
        route: 'v3',
        sender_id: this.config.from || 'TXTIND',
        message: smsMessage.message,
        language: 'english',
        flash: '0',
        numbers: smsMessage.to,
      }),
    });

    const data = await response.json();

    if (!response.ok || data.return !== true) {
      throw new Error(data.message || 'Fast2SMS failed');
    }

    return {
      success: true,
      messageId: data.request_id,
      cost: parseFloat(data.cost || '0')
    };
  }
}

// Export singleton instance
export const smsService = new SMSService();

// Export for custom configuration
export { SMSService };
