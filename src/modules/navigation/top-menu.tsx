import { Link, useLocation } from "react-router";
import { House, Languages, Milk } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../components/navigation-menu";
import { Button } from "../../components/button";

export function TopMenu() {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const current = (i18n.resolvedLanguage || i18n.language || "en").split(
    "-",
  )[0];
  const currentLng = current === "de" ? "de" : "en";
  const nextLng = currentLng === "en" ? "de" : "en";

  return (
    <div className="flex items-center w-full gap-3">
      <NavigationMenu className="w-auto">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              data-state={location.pathname === "/" ? "open" : "closed"}
            >
              <NavigationMenuLink
                asChild
                data-active={location.pathname === "/"}
              >
                <Link to="/" className="flex flex-row items-center">
                  <House className="mr-1" /> {t("navigation.home")}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuTrigger>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger
              data-state={location.pathname === "/products" ? "open" : "closed"}
            >
              <NavigationMenuLink
                asChild
                data-active={location.pathname === "/products"}
              >
                <Link to="/products" className="flex flex-row items-center">
                  <Milk className="mr-1" /> {t("navigation.products")}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex-1" />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => i18n.changeLanguage(nextLng)}
        aria-label={t("navigation.languageToggle", { lng: nextLng })}
      >
        <Languages className="size-4" />
        {currentLng}
      </Button>
    </div>
  );
}
