export enum PluginId {
  MARLIN_TEE = '@elizaos-plugins/tee-marlin',
  EVM = '@elizaos-plugins/evm',
  COMPUTER_USE = '@elizaos-plugins/computer-use',
}

export interface PluginInfo {
  name: string;
  description: string;
  category: 'security' | 'blockchain' | 'ai' | 'other';
}

export const PluginRegistry: Record<PluginId, PluginInfo> = {
  [PluginId.MARLIN_TEE]: {
    name: 'Marlin TEE',
    description: 'Secure enclave for private AI computation',
    category: 'security',
  },
  [PluginId.EVM]: {
    name: 'EVM',
    description: 'Ethereum Virtual Machine integration',
    category: 'blockchain',
  },
  [PluginId.COMPUTER_USE]: {
    name: 'Computer Use',
    description: 'Enable AI agents to interact with computer systems',
    category: 'ai',
  },
};

export const PluginNames: Record<PluginId, string> = {
  [PluginId.MARLIN_TEE]: 'Marlin TEE',
  [PluginId.EVM]: 'EVM',
  [PluginId.COMPUTER_USE]: 'Computer Use',
};