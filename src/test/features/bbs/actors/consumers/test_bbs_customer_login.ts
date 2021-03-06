import api, { Primitive } from "../../../../../api";
import { IBbsCustomer } from "../../../../../api/structures/bbs/actors/IBbsCustomer";
import { IBbsMember } from "../../../../../api/structures/bbs/actors/IBbsMember";

import { Configuration } from "../../../../../Configuration";
import { exception_must_be_thrown } from "../../../../internal/exception_must_be_thrown";
import { test_bbs_customer_issue } from "./test_bbs_customer_issue";
import { test_bbs_customer_join } from "./test_bbs_customer_join";

export async function test_bbs_customer_login(connection: api.IConnection): Promise<IBbsCustomer>
{
    const customer: IBbsCustomer = await test_bbs_customer_join(connection);
    delete (connection.headers as any)["bbs-customer-authorization"];

    const reloaded: IBbsCustomer = await test_bbs_customer_issue(connection);
    await exception_must_be_thrown
    (
        "Invalid password", 
        () => api.functional.bbs.customers.authenticate.login
        (
            connection,
            {
                email: customer.member!.email,
                password: "Wrong Password"
            }
        )
    );

    const member: IBbsMember = await api.functional.bbs.customers.authenticate.login
    (
        connection,
        {
            email: customer.member!.email,
            password: Configuration.SYSTEM_PASSWORD
        }
    );
    if (Primitive.equal_to(member, customer.member!) === false)
        throw new Error("Bug on BbsCustomerProvider.login(): different result with join().");

    return {
        ...reloaded,
        citizen: member.citizen,
        member,
    };
}