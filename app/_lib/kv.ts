import Cloudflare from "cloudflare";

const NAMESPACE_ID = process.env.CLOUDFLARE_KV_NAMESPACE_ID!;
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!;

const client = new Cloudflare({
	apiToken: process.env.CLOUDFLARE_KV_TOKEN,
});

const BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${process.env.CLOUDFLARE_KV_NAMESPACE_ID}/values`;

export const get = async <Type>(key: string): Promise<Type | null> => {
	try {
		const response = await client.kv.namespaces.values.get(NAMESPACE_ID, key, {
			account_id: ACCOUNT_ID,
		});
		const { result, success } = (await response.json()) as {
			result: Type | null;
			success: boolean;
		};
		if (!success) return null;
		return result;
	} catch {
		return null;
	}
};

export const set = async (key: string, value: unknown) => {
	const response = await client.kv.namespaces.values.update(NAMESPACE_ID, key, {
		account_id: ACCOUNT_ID,
		value: JSON.stringify(value),
		metadata: "{}",
	});
	return response;
};
