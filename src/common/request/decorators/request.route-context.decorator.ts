/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';

import { RouteContext } from '../guards/role-based-auth.guard';

export const RouteContextDecorator = (context: RouteContext) =>
    SetMetadata('routeContext', context);

export const MarketplaceRoute = () =>
    RouteContextDecorator(RouteContext.MARKETPLACE);
export const DriverRoute = () => RouteContextDecorator(RouteContext.DRIVER);
