import * as path from 'path'
import importFresh from 'import-fresh'
import {
  resolveConfig,
  TailwindConfig,
  ResolvedTailwindConfig
} from '@xwind/core'
import { getHash, resolvePath, getFile } from './util'

export function getTwConfigPath(
  relativePath: string | undefined = './tailwind.config.js'
) {
  return resolvePath(relativePath, `No config file found at ${relativePath}`)
}

export function getTwConfig(twConfigPath: string): ResolvedTailwindConfig {
  return resolveConfig(importFresh(twConfigPath) as TailwindConfig)
}

export function getTwConfigHash(twConfigPath: string) {
  const file = getFile(twConfigPath, `No config file found at ${twConfigPath}`)
  return getHash(file)
}

////////////////
//CACHE VALUES//
////////////////
let $twConfigHash: ReturnType<typeof getTwConfigHash>
let $twConfig: ReturnType<typeof getTwConfig>

export function getTwConfigCache(
  twConfigPath: ReturnType<typeof getTwConfigPath>
) {
  const twConfigHash = getTwConfigHash(twConfigPath)
  if ($twConfigHash !== twConfigHash) {
    $twConfigHash = getTwConfigHash(twConfigPath)
    $twConfig = getTwConfig(twConfigPath)
    return {
      hash: $twConfigHash,
      isNewTwConfig: true,
      twConfig: $twConfig
    }
  }
  return {
    hash: $twConfigHash,
    isNewTwConfig: false,
    twConfig: $twConfig
  }
}
