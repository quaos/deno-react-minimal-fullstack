export class AppConfig {
    appName: string = "deno-react-minimal-fullstack";
    appVersion: string = "0.0.1";
    appFrontUrl: string = "http://localhost/";
    host: string = "0.0.0.0";
    port: number = 3000;
    
    public constructor(attrs?: Partial<AppConfig>) {
        Object.assign(this, attrs);
    }

    static fromEnv(): AppConfig {
        let portStr = Deno.env.get("APP_PORT");

        const config = new AppConfig(<AppConfig> {
            appName: Deno.env.get("APP_NAME"),
            appVersion: Deno.env.get("APP_VERSION"),
            appFrontUrl: Deno.env.get("APP_FRONT_URL"),
            host: Deno.env.get("APP_HOST"),
            port: (portStr) ? Number(portStr) : undefined,
        });

        return config;
    }
}
