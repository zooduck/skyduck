export const version = async (): Promise<string> => {
    const versionResponse = await fetch('/version');
    const version =  await versionResponse.text();

    return version;
};
