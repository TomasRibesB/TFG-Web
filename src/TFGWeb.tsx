import { AppRouter } from "./presentation/router/AppRouter";
import { AppTheme } from "./presentation/theme";

export const TFGWeb = () => {
  return (
    <AppTheme>
      <AppRouter />
    </AppTheme>
  );
};
