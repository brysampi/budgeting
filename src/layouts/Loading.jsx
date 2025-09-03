// import { useEffect, useRef } from 'react';



const Loading = ({ onLoading }) => {
    // const backdropRef = useRef();
    // console.log('loading ba?: ', onLoading)

    return (
        <>
            {onLoading ? (
                <div className='backdrop-loading'>Loading...</div>
            ) : (
                <div></div>
            )}
            {/* {onLoading && <div ref={backdropRef} className='backdrop-loading'>Loading...</div>} */}
        </>
    )
}
export default Loading;