import React from "react";
import { useMutation, UseMutationResult } from "react-query";
import qs from "qs";

import { AuthContext } from "@contexts/auth";

import { IAuthContext, TLoginData } from "../../../interfaces";
import { useNavigation, useRouterContext, useNotification } from "@hooks";

/**
 * `useLogin` calls `login` method from {@link https://refine.dev/docs/api-references/providers/auth-provider `authProvider`} under the hood.
 *
 * @see {@link https://refine.dev/docs/core/hooks/auth/useLogin} for more details.
 *
 * @typeParam TData - Result data of the query
 * @typeParam TVariables - Values for mutation function. default `{}`
 *
 */
export const useLogin = <TVariables = {}>(): UseMutationResult<
    TLoginData,
    Error,
    TVariables,
    unknown
> => {
    const { replace } = useNavigation();
    const { login: loginFromContext } =
        React.useContext<IAuthContext>(AuthContext);

    const { useLocation } = useRouterContext();
    const { search } = useLocation();
    const { close, open } = useNotification();

    const { to } = qs.parse(search?.substring(1));

    const queryResponse = useMutation<TLoginData, Error, TVariables, unknown>(
        "useLogin",
        loginFromContext,
        {
            onSuccess: (redirectPathFromAuth) => {
                if (to) {
                    return replace(to as string);
                }

                if (redirectPathFromAuth !== false) {
                    if (redirectPathFromAuth) {
                        replace(redirectPathFromAuth);
                    } else {
                        replace("/");
                    }
                }
                close("login-error");
            },
            onError: (error: any) => {
                open({
                    message: error?.name || "Login Error",
                    description: error?.message || "Invalid credentials",
                    key: "login-error",
                    type: "error",
                });
            },
        },
    );

    return queryResponse;
};
