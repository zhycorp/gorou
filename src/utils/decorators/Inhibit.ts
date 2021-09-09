/* eslint-disable func-names, @typescript-eslint/naming-convention */
import { CommandContext } from "../../structures/CommandContext";
import { createEmbed } from "../createEmbed";

export function inhibit<T extends (ctx: CommandContext, ...args: any[]) => Promise<string|void> | (string|void)>(func: T) {
    return function (_: unknown, __: string, descriptor: PropertyDescriptor): void {
        const method = descriptor.value;
        if (!method) throw new Error("Descriptor value isn't provided");
        descriptor.value = async function (ctx: CommandContext, ...args: any[]): Promise<any> {
            const message = await func(ctx, ...args);
            if (typeof message === "string") {
                if (message.length) {
                    if (ctx.isInteraction() && !ctx.deferred) {
                        await ctx.deferReply();
                    }
                    return ctx.send({
                        embeds: [createEmbed("error", message, true)]
                    });
                }
            }
            await method.call(this, ctx, ...args);
        };
    };
}
