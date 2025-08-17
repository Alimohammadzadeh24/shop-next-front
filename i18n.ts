import { getRequestConfig, type GetRequestConfigParams, type RequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }: GetRequestConfigParams): Promise<RequestConfig> => {
  const validLocale: string = locale || "fa";
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
