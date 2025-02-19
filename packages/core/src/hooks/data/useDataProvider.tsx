import { useCallback, useContext } from "react";
import { DataContext } from "@contexts/data";
import {
    IDataContextProvider,
    IDataMultipleContextProvider,
} from "src/interfaces";

export const useDataProvider = (): ((
    dataProviderName?: string,
) => IDataContextProvider) => {
    const context = useContext<IDataMultipleContextProvider>(DataContext);

    const handleDataProvider = useCallback(
        (dataProviderName?: string) => {
            if (dataProviderName) {
                const dataProvider = context[dataProviderName];
                if (!dataProvider) {
                    throw new Error(
                        `"${dataProviderName}" Data provider not found`,
                    );
                }
                return context[dataProviderName];
            }
            if (context.default) {
                return context.default;
            } else
                throw new Error(
                    `There is no "default" data provider. Please pass dataProviderName.`,
                );
        },
        [context],
    );

    return handleDataProvider;
};
