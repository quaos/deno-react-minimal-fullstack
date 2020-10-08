import { merge } from "../../common/utils.ts";

export class AppConfig {
    appName: string = "deno-react-minimal-fullstack";
    appVersion: string = "1.0.0";
    appFrontUrl: string = "http://localhost:3000/";
    appFrontOrigin: string = "http://localhost:3000";
    host: string = "0.0.0.0";
    port: number = 8080;
    
    public constructor(attrs?: Partial<AppConfig>) {
        (attrs) && merge(this, attrs);
    }

    static fromEnv(): AppConfig {
        let portStr = Deno.env.get("APP_PORT");

        const config = new AppConfig(<Partial<AppConfig>> {
            appName: Deno.env.get("APP_NAME"),
            appVersion: Deno.env.get("APP_VERSION"),
            appFrontUrl: Deno.env.get("APP_FRONT_URL"),
            appFrontOrigin: Deno.env.get("APP_FRONT_ORIGIN"),
            host: Deno.env.get("APP_HOST"),
            port: (portStr) ? Number(portStr) : undefined,
        });
        
        return config;
    }
}
