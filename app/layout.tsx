import { Metadata } from 'next';

import ContextAccount from 'components/Context/ContextAccount';
import ContextExtension from 'components/Context/ContextExtension';
import ContextProviders from 'components/Context/ContextProviders';
import ContextVolume from 'components/Context/ContextVolume';
import ProviderChakra from 'layout/Provider/ProviderChakra';
import ProviderDefault from 'layout/Provider/ProviderDefault';
import ProviderQueryClient from 'layout/Provider/ProviderQueryClient';

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
          <ProviderChakra>
            <ContextExtension>
              <ContextProviders>
                <ContextAccount>
                  <ProviderDefault>{children}</ProviderDefault>
                </ContextAccount>
              </ContextProviders>
            </ContextExtension>
            <ContextVolume></ContextVolume>
          </ProviderChakra>
        </ProviderQueryClient>
      </body>
    </html>
  );
}
