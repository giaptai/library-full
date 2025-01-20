export const SpinnerLoading = () => {
    return (
        <div className="container m-5 text-center px-0 m-auto" style={{ height: 550 }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}