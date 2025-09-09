import { createAdapter, type CreateCustomAdapter } from "better-auth/adapters";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { env } from "@/env.js";

export function convexAdapter() {
  const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

  const adapter: CreateCustomAdapter = ({ getFieldName }) => {
    const log = (...args: unknown[]) => {
      try {
        console.log("[ConvexAdapter]", ...args);
      } catch {}
    };
    const toEpoch = (value: unknown): number => {
      if (typeof value === "number" && Number.isFinite(value)) {
        // If value looks like seconds (e.g., < 1e12), convert to ms
        return value < 1e12 ? Math.trunc(value * 1000) : Math.trunc(value);
      }
      if (value instanceof Date) return value.getTime();
      if (typeof value === "string") {
        const t = Date.parse(value);
        if (Number.isFinite(t)) return t;
      }
      return Date.now();
    };
    return {
      async create(ctx: { model: string; data: Record<string, unknown> }) {
        const { model, data } = ctx;
        switch (model) {
          case "user": {
            const payload = {
              id: String(data.id),
              email: String(data.email),
              name: String(data.name),
              image: typeof data.image === "string" ? data.image : undefined,
              emailVerified: Boolean(data.emailVerified),
              createdAt: toEpoch(data.createdAt),
              updatedAt: toEpoch(data.updatedAt),
            } satisfies Parameters<typeof convex.mutation<typeof api.auth.createUser>>[1];
            await convex.mutation(api.auth.createUser, payload);
            return payload as unknown as Record<string, unknown>;
          }
          case "account": {
            const payload = {
              id: String(data.id),
              userId: String(data.userId),
              providerId: String(data.providerId),
              accountId: String(data.accountId),
              accessToken: typeof data.accessToken === "string" ? data.accessToken : undefined,
              refreshToken: typeof data.refreshToken === "string" ? data.refreshToken : undefined,
              idToken: typeof data.idToken === "string" ? data.idToken : undefined,
              scope: typeof data.scope === "string" ? data.scope : undefined,
              accessTokenExpiresAt:
                data.accessTokenExpiresAt !== undefined ? toEpoch(data.accessTokenExpiresAt) : undefined,
              refreshTokenExpiresAt:
                data.refreshTokenExpiresAt !== undefined ? toEpoch(data.refreshTokenExpiresAt) : undefined,
              createdAt: toEpoch(data.createdAt),
              updatedAt: toEpoch(data.updatedAt),
            } satisfies Parameters<typeof convex.mutation<typeof api.auth.createAccount>>[1];
            await convex.mutation(api.auth.createAccount, payload);
            return payload as unknown as Record<string, unknown>;
          }
      case "session": {
        const tokenFromData = typeof (data as { token?: unknown }).token === "string" ? (data as { token?: string }).token : undefined;
        const payload = {
          // Store the session token as the DB id (schema comment indicates id is session token)
          id: tokenFromData ?? String(data.id),
          userId: String(data.userId),
          expiresAt: toEpoch(data.expiresAt),
          createdAt: toEpoch(data.createdAt),
          updatedAt: toEpoch(data.updatedAt),
          ipAddress: typeof data.ipAddress === "string" ? data.ipAddress : undefined,
          userAgent: typeof data.userAgent === "string" ? data.userAgent : undefined,
        } satisfies Parameters<typeof convex.mutation<typeof api.auth.createSession>>[1];
        log("create.session", payload);
        await convex.mutation(api.auth.createSession, payload);
        
        const result = {
          id: String(payload.id),
          userId: String(payload.userId),
          token: tokenFromData ?? String(payload.id),
          expiresAt: new Date(payload.expiresAt),
          createdAt: new Date(payload.createdAt),
          updatedAt: new Date(payload.updatedAt),
          ipAddress: payload.ipAddress,
          userAgent: payload.userAgent,
        };
        log("create.session.returning", result);
        return result as unknown as Record<string, unknown>;
      }
          case "verification": {
            const payload = {
              id: String(data.id),
              identifier: String(data.identifier),
              value: String(data.value),
              expiresAt: toEpoch(data.expiresAt),
              createdAt: toEpoch(data.createdAt),
              updatedAt: toEpoch(data.updatedAt),
            } satisfies Parameters<typeof convex.mutation<typeof api.auth.createVerification>>[1];
            log("create.verification", {
              id: payload.id,
              identifier: payload.identifier,
              value: payload.value,
              expiresAt: payload.expiresAt,
            });
            await convex.mutation(api.auth.createVerification, payload);
            return payload as unknown as Record<string, unknown>;
          }
          default:
            return data;
        }
      },
      async findOne(ctx: { model: string; where?: Array<{ field: string; value: unknown }> }) {
        const { model, where } = ctx;
        log("findOne", { model, where });
        switch (model) {
          case "user": {
            const byId = where?.find((w) => getFieldName({ model, field: w.field }) === "id");
            if (byId) return await convex.query(api.auth.getUserById, { id: String(byId.value) });
            const byEmail = where?.find((w) => getFieldName({ model, field: w.field }) === "email");
            if (byEmail)
              return await convex.query(api.auth.getUserByEmail, { email: String(byEmail.value) });
            return null;
          }
          case "account": {
            const prov = where?.find((w) => getFieldName({ model, field: w.field }) === "providerId");
            const acc = where?.find((w) => getFieldName({ model, field: w.field }) === "accountId");
            if (prov && acc) {
              return await convex.query(api.auth.getAccountByProviderAccountId, {
                providerId: String(prov.value),
                accountId: String(acc.value),
              });
            }
            return null;
          }
      case "session": {
        log("findOne.session.where", where);
        // Support lookups by token (map to DB id) and by id
        const byToken = where?.find((w) => w.field === "token");
        if (byToken && typeof byToken.value === "string") {
          log("findOne.session.byToken", byToken);
          const token = String(byToken.value);
          const row = await convex.query(api.auth.getSessionById, { id: token });
          if (!row) {
            log("findOne.session.NOT_FOUND_BY_TOKEN", token);
            return null;
          }
          const formatted = {
            ...row,
            token: token,
            expiresAt: new Date(row.expiresAt),
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
          };
          log("findOne.session.formatted", formatted);
          return formatted;
        }
        const byId = where?.find((w) => getFieldName({ model, field: w.field }) === "id");
        if (byId) {
          log("findOne.session.byId", byId);
          log("findOne.session.searchingFor", String(byId.value));
          const result = await convex.query(api.auth.getSessionById, { id: String(byId.value) });
          log("findOne.session.result", result);
          log("findOne.session.result.type", typeof result);
          log("findOne.session.result.keys", result ? Object.keys(result) : "null");
          
          if (!result) {
            log("findOne.session.NOT_FOUND", "Session not found in database");
          } else {
            // Convert epoch timestamps back to Date objects for Better Auth and include token
            const formattedResult = {
              ...result,
              token: result.id,
              expiresAt: new Date(result.expiresAt),
              createdAt: new Date(result.createdAt),
              updatedAt: new Date(result.updatedAt),
            };
            log("findOne.session.formatted", formattedResult);
            return formattedResult;
          }
          
          return result;
        }
        log("findOne.session.NO_ID_FILTER", "No id filter provided");
        return null;
      }
          case "verification": {
            log("findOne.verification.where", where);
            const byId = where?.find((w) => getFieldName({ model, field: w.field }) === "id");
            if (byId) {
              log("findOne.verification.byId", byId);
              const row = await convex.query(api.auth.getVerificationById, { id: String(byId.value) });
              if (row) return row;
            }
            const byValue = where?.find((w) => getFieldName({ model, field: w.field }) === "value");
            if (byValue) {
              log("findOne.verification.byValue", byValue);
              const row = await convex.query(api.auth.getVerificationByValue, { value: String(byValue.value) });
              if (row) return row;
            }
            const ident = where?.find((w) => getFieldName({ model, field: w.field }) === "identifier");
            const value = where?.find((w) => getFieldName({ model, field: w.field }) === "value");
            if (ident && value) {
              log("findOne.verification.byIdentifierValue", { ident, value });
              const row = await convex.query(api.auth.getVerification, {
                identifier: String(ident.value),
                value: String(value.value),
              });
              if (row) return row;
            }
            if (ident && !value) {
              log("findOne.verification.byIdentifierOnly", { ident });
              const rows = await convex.query(api.auth.getVerificationsByIdentifier, {
                identifier: String(ident.value),
              });
              if (rows && rows.length > 0) return rows[0];
            }
            // Fallback: try any provided value against both id and value
            const anyClause = where?.[0];
            if (anyClause && typeof anyClause.value === "string") {
              log("findOne.verification.fallback", anyClause);
              const candidate = String(anyClause.value);
              let row = await convex.query(api.auth.getVerificationById, { id: candidate });
              if (row) return row;
              row = await convex.query(api.auth.getVerificationByValue, { value: candidate });
              if (row) return row;
            }
            return null;
          }
          default:
            return null;
        }
      },
      async findMany(ctx: { model: string; where?: Array<{ field: string; value: unknown; operator?: string }>; limit?: number; offset?: number }) {
        const { model, where, limit, offset } = ctx;
        log("findMany", { model, where, limit, offset });
        
        if (model === "session") {
          log("findMany.session.CALLED", "Better Auth is looking for sessions with findMany");
          log("findMany.session.where", where);
        }
        
        switch (model) {
          case "verification": {
            const byId = where?.find((w) => w.field === "id");
            if (byId && typeof byId.value === "string") {
              const row = await convex.query(api.auth.getVerificationById, { id: byId.value });
              return row ? [row] : [];
            }
            const byIdentifier = where?.find((w) => w.field === "identifier");
            if (byIdentifier && typeof byIdentifier.value === "string") {
              const rows = await convex.query(api.auth.getVerificationsByIdentifier, {
                identifier: byIdentifier.value,
              });
              return rows;
            }
            const byValue = where?.find((w) => w.field === "value");
            if (byValue && typeof byValue.value === "string") {
              const row = await convex.query(api.auth.getVerificationByValue, { value: byValue.value });
              return row ? [row] : [];
            }
            return [];
          }
          case "account": {
            const userId = where?.find((w) => getFieldName({ model, field: w.field }) === "userId");
            if (userId) {
              const rows = await convex.query(api.auth.getAccountsByUserId, {
                userId: String(userId.value),
              });
              return rows.slice(offset ?? 0, (offset ?? 0) + (limit ?? rows.length));
            }
            return [];
          }
          case "session": {
            log("findMany.session.processing", "Processing session findMany request");
            const userId = where?.find((w) => getFieldName({ model, field: w.field }) === "userId");
            if (userId) {
              log("findMany.session.byUserId", String(userId.value));
              const rows = await convex.query(api.auth.getSessionsByUserId, {
                userId: String(userId.value),
              });
              log("findMany.session.found", rows.length);
              const result = rows.slice(offset ?? 0, (offset ?? 0) + (limit ?? rows.length));
              
              // Convert epoch timestamps back to Date objects for Better Auth and include token
              const formattedResult = result.map(row => ({
                ...row,
                token: row.id,
                expiresAt: new Date(row.expiresAt),
                createdAt: new Date(row.createdAt),
                updatedAt: new Date(row.updatedAt),
              }));
              log("findMany.session.returning", formattedResult.length);
              return formattedResult;
            }
            log("findMany.session.noUserId", "No userId filter provided");
            return [];
          }
          default:
            return [];
        }
      },
      async update(ctx: { model: string; where?: Array<{ field: string; value: unknown }>; update: Record<string, unknown> }) {
        const { model, where, update } = ctx;
        switch (model) {
          case "user": {
            const byId = where?.find((w) => getFieldName({ model, field: w.field }) === "id");
            if (!byId) return null;
            const payload = {
              id: String(byId.value),
              data: {
                email: typeof update.email === "string" ? update.email : undefined,
                name: typeof update.name === "string" ? update.name : undefined,
                image: typeof update.image === "string" ? update.image : undefined,
                emailVerified: typeof update.emailVerified === "boolean" ? update.emailVerified : undefined,
                updatedAt: typeof update.updatedAt === "number" ? update.updatedAt : undefined,
              },
            } satisfies Parameters<typeof convex.mutation<typeof api.auth.updateUser>>[1];
            return await convex.mutation(api.auth.updateUser, payload);
          }
          case "account": {
            const byId = where?.find((w) => getFieldName({ model, field: w.field }) === "id");
            if (!byId) return null;
            const payload = {
              id: String(byId.value),
              data: {
                accessToken: typeof update.accessToken === "string" ? update.accessToken : undefined,
                refreshToken: typeof update.refreshToken === "string" ? update.refreshToken : undefined,
                idToken: typeof update.idToken === "string" ? update.idToken : undefined,
                scope: typeof update.scope === "string" ? update.scope : undefined,
                accessTokenExpiresAt:
                  typeof update.accessTokenExpiresAt === "number" ? update.accessTokenExpiresAt : undefined,
                refreshTokenExpiresAt:
                  typeof update.refreshTokenExpiresAt === "number" ? update.refreshTokenExpiresAt : undefined,
                updatedAt: typeof update.updatedAt === "number" ? update.updatedAt : undefined,
              },
            } satisfies Parameters<typeof convex.mutation<typeof api.auth.updateAccount>>[1];
            return await convex.mutation(api.auth.updateAccount, payload);
          }
          case "session": {
            const byId = where?.find((w) => getFieldName({ model, field: w.field }) === "id");
            if (!byId) return null;
            const payload = {
              id: String(byId.value),
              data: {
                expiresAt: typeof update.expiresAt === "number" ? update.expiresAt : undefined,
                updatedAt: typeof update.updatedAt === "number" ? update.updatedAt : undefined,
                ipAddress: typeof update.ipAddress === "string" ? update.ipAddress : undefined,
                userAgent: typeof update.userAgent === "string" ? update.userAgent : undefined,
              },
            } satisfies Parameters<typeof convex.mutation<typeof api.auth.updateSession>>[1];
            return await convex.mutation(api.auth.updateSession, payload);
          }
          default:
            return null;
        }
      },
      async delete(ctx: { model: string; where?: Array<{ field: string; value: unknown }> }) {
        const { model, where } = ctx;
        log("delete", { model, where });
        const byId = where?.find((w) => getFieldName({ model, field: w.field }) === "id");
        if (!byId) return;
        if (model === "session") {
          await convex.mutation(api.auth.deleteSession, { id: String(byId.value) });
          return;
        }
        if (model === "account") {
          await convex.mutation(api.auth.deleteAccount, { id: String(byId.value) });
          return;
        }
        if (model === "verification") {
          await convex.mutation(api.auth.deleteVerification, { id: String(byId.value) });
          return;
        }
      },
      async deleteMany(ctx: { model: string; where?: Array<{ field: string; value: unknown }> }) {
        const { model, where } = ctx;
        log("deleteMany", { model, where });
        if (model === "verification") {
          const ident = where?.find((w) => getFieldName({ model, field: w.field }) === "identifier");
          if (ident) {
            const rows = await convex.query(api.auth.getVerificationsByIdentifier, {
              identifier: String(ident.value),
            });
            await Promise.all(
              rows.map((r) => convex.mutation(api.auth.deleteVerification, { id: r.id })),
            );
          }
        }
      },
      options: {
        adapterId: "convex",
        adapterName: "Convex Adapter",
        usePlural: false,
        debugLogs: false,
      },
    } as unknown as ReturnType<CreateCustomAdapter>;
  };

  return createAdapter({
    adapter,
    config: { adapterId: "convex", adapterName: "Convex Adapter", usePlural: false, debugLogs: false },
  });
}


