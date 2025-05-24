import { Metadata } from 'next';

import ContextVolume from 'components/Context/ContextVolume';
import ProviderChakra from 'layout/Provider/ProviderChakra';
import ProviderDefault from 'layout/Provider/ProviderDefault';
import ProviderQueryClient from 'layout/Provider/ProviderQueryClient';
import ProviderSuiDapp from 'layout/Provider/ProviderSuiDapp';

export const metadata: Metadata = {
  title: 'Ticket Battles',
  description:
    'Swap tickets, join battles, and win surprise NFTs with unique rarities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="mdl-js">
      <head>
        {/* 
          - was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 
          - https://stackoverflow.com/a/75595488/16151303
        */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </head>

      <body>
        <ProviderQueryClient>
          <ProviderSuiDapp>
            <ContextVolume>
              <ProviderChakra>
                <ProviderDefault>{children}</ProviderDefault>
              </ProviderChakra>
            </ContextVolume>
          </ProviderSuiDapp>
        </ProviderQueryClient>
      </body>
    </html>
  );
}
