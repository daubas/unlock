import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import UnlockPropTypes from '../propTypes'
import Overlay from './lock/Overlay'
import DeveloperOverlay from './developer/DeveloperOverlay'
import ShowWhenLocked from './lock/ShowWhenLocked'
import ShowWhenUnlocked from './lock/ShowWhenUnlocked'
import GlobalErrorProvider from '../utils/GlobalErrorProvider'
import { UnlockedFlag } from './lock/UnlockFlag'
import { lockRoute } from '../utils/routes'
import useListenForPostMessage from '../hooks/browser/useListenForPostMessage'
import usePostMessage from '../hooks/browser/usePostMessage'
import {
  POST_MESSAGE_LOCKED,
  POST_MESSAGE_UNLOCKED,
} from '../paywall-builder/constants'
import { isPositiveNumber } from '../utils/validators'
import useWindow from '../hooks/browser/useWindow'
import useOptimism from '../hooks/useOptimism'
import { TRANSACTION_TYPES } from '../constants'
import withConfig from '../utils/withConfig'
import './Paywall.css'

export function Paywall({ locks, locked, redirect, account, transaction }) {
  const optimism = useOptimism(transaction)
  const window = useWindow()
  const scrollPosition = useListenForPostMessage({
    type: 'scrollPosition',
    defaultValue: 0,
    validator: isPositiveNumber,
  })
  const { postMessage } = usePostMessage()
  const smallBody = body => {
    body.className = 'small'
  }
  const bigBody = body => {
    body.className = 'big'
  }
  useEffect(() => {
    if (locked) {
      postMessage(POST_MESSAGE_LOCKED)
    } else {
      postMessage(POST_MESSAGE_UNLOCKED)
      if (redirect) {
        const withAccount = account ? '#' + account : ''
        window.location.href = redirect + withAccount
      }
      smallBody(window.document.body)
    }
  }, [locked])
  useEffect(() => {
    if (!locked || !transaction) return
    if (transaction.status === 'pending' && redirect) {
      window.location.href = redirect + '#' + transaction.hash
    }
  }, [transaction, locked, redirect])

  return (
    <GlobalErrorProvider>
      <ShowWhenLocked locked={locked}>
        <Overlay
          scrollPosition={scrollPosition}
          locks={locks}
          redirect={redirect}
          optimism={optimism}
          smallBody={() => smallBody(window.document.body)}
          bigBody={() => bigBody(window.document.body)}
        />
        {optimism.current ? null : <DeveloperOverlay />}
      </ShowWhenLocked>
      <ShowWhenUnlocked locked={locked}>
        <UnlockedFlag />
      </ShowWhenUnlocked>
    </GlobalErrorProvider>
  )
}

Paywall.propTypes = {
  locks: PropTypes.arrayOf(UnlockPropTypes.lock).isRequired,
  locked: PropTypes.bool.isRequired,
  redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  transaction: UnlockPropTypes.transaction,
  account: PropTypes.string,
}

Paywall.defaultProps = {
  redirect: false,
  account: null,
  transaction: null,
}

export const mapStateToProps = (
  { locks, keys, modals, router, account, transactions },
  { config: { requiredConfirmations } }
) => {
  const { lockAddress, redirect } = lockRoute(router.location.pathname)

  const lockFromUri = Object.values(locks).find(
    lock => lock.address === lockAddress
  )

  let validKeys = []
  const locksFromUri = lockFromUri ? [lockFromUri] : []
  locksFromUri.forEach(lock => {
    for (let k of Object.values(keys)) {
      if (
        k.lock === lock.address &&
        k.expiration > new Date().getTime() / 1000
      ) {
        validKeys.push(k)
      }
    }
  })

  const lock = locksFromUri.length ? locksFromUri[0] : null

  let transaction = null

  const lockKey = Object.values(keys).find(
    key =>
      account &&
      lock &&
      key.lock === lock.address &&
      key.owner === account.address
  )

  // Let's select the transaction corresponding to this key purchase, if it exists
  // This transaction is of type KEY_PURCHASE
  transaction = Object.values(transactions).find(
    transaction =>
      transaction.type === TRANSACTION_TYPES.KEY_PURCHASE &&
      transaction.key === (lockKey && lockKey.id)
  )

  const modalShown = !!modals[locksFromUri.map(l => l.address).join('-')]
  let locked = false
  if (modalShown) {
    locked = true
  }
  if (!locked && !validKeys.length) {
    locked = true
  }
  if (!locked && transaction) {
    if (
      !transaction.confirmations ||
      transaction.confirmations < requiredConfirmations
    ) {
      locked = true
    }
  }

  return {
    locked,
    locks: locksFromUri,
    redirect,
    transaction,
    account: account && account.address,
  }
}

export default withConfig(connect(mapStateToProps)(Paywall))
