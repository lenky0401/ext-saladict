import React, { ComponentType, FC, useMemo, Suspense } from 'react'
import root from 'react-shadow'
import { Word } from '@/_helpers/record-manager'
import { DictID } from '@/app-config'
import { ViewPorps } from '@/components/dictionaries/helpers'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export interface DictItemBodyProps {
  dictID: DictID

  fontSize: number
  withAnimation: boolean

  searchStatus: 'IDLE' | 'SEARCHING' | 'FINISH'
  searchResult?: object | null

  searchText: (arg?: {
    id?: DictID
    word?: Word
    payload?: { [index: string]: any }
  }) => any
}

export const DictItemBody: FC<DictItemBodyProps> = props => {
  const Dict = useMemo(
    () =>
      React.lazy<ComponentType<ViewPorps<any>>>(() =>
        import(
          /* webpackInclude: /View\.tsx$/ */
          /* webpackChunkName: "dicts/[request]" */
          /* webpackMode: "lazy" */
          /* webpackPrefetch: true */
          /* webpackPreload: true */
          `@/components/dictionaries/${props.dictID}/View.tsx`
        )
      ),
    [props.dictID]
  )

  return (
    <ErrorBoundary error={DictRenderError}>
      <Suspense fallback={null}>
        {props.searchStatus === 'FINISH' && props.searchResult && (
          <root.div>
            <style>
              {require('@/components/dictionaries/' +
                props.dictID +
                '/_style.shadow.scss').toString()}
            </style>
            <style>
              {`.dictRoot {
                  font-size: ${props.fontSize}px;
                  -webkit-font-smoothing: antialiased;
                  text-rendering: optimizelegibility;
                  font-family: "Helvetica Neue", Helvetica, Arial, "Hiragino Sans GB", "Hiragino Sans GB W3", "Microsoft YaHei UI", "Microsoft YaHei", sans-serif;
                }`}
            </style>
            <div
              className={`d-${props.dictID} dictRoot${
                props.withAnimation ? ' isAnimate' : ''
              }`}
            >
              <Dict result={props.searchResult} searchText={props.searchText} />
            </div>
          </root.div>
        )}
      </Suspense>
    </ErrorBoundary>
  )
}

function DictRenderError() {
  return (
    <p style={{ textAlign: 'center' }}>
      Render error. Please{' '}
      <a
        href="https://github.com/crimx/ext-saladict/issues"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        report issue
      </a>
      .
    </p>
  )
}