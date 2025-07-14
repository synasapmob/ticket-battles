import { Eip1193Provider, ethers } from 'ethers';

export interface TypeEIP6963Info {
  uuid: string;
  name: string;
  icon: string;
  rdns?: string;
}

export interface TypeEIP6963Props {
  accounts: string[];
  info: TypeEIP6963Info;
  provider: ethers.BrowserProvider & Eip1193Provider;
}
