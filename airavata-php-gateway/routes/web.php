<?php
// Migrated from app/routes.php for Laravel 8

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\BaseController;
use App\Http\Controllers\ComputeResourceController;
use App\Http\Controllers\DataCatController;
use App\Http\Controllers\ExperimentController;
use App\Http\Controllers\FilemanagerController;
use App\Http\Controllers\GatewayprofileController;
use App\Http\Controllers\GatewayRequestUpdateController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\StorageResourceController;
use App\Http\Controllers\UserSettingsController;

Route::get('create', [AccountController::class, 'createAccountView']);
Route::post('create', [AccountController::class, 'createAccountSubmit']);
Route::get('login', [AccountController::class, 'loginView']);
Route::post('login', [AccountController::class, 'loginSubmit']);
Route::get('login-desktop', [AccountController::class, 'loginDesktopView']);
Route::get('refreshed-token-desktop', [AccountController::class, 'getRefreshedTokenForDesktop']);
Route::get('account/dashboard', [AccountController::class, 'dashboard']);
Route::get('account/update-gateway', [GatewayRequestUpdateController::class, 'updateGateway']);
Route::get('callback-url', [AccountController::class, 'oauthCallback']);
Route::get('logout', [AccountController::class, 'logout']);
Route::post('api-login', [AccountController::class, 'apiLoginSubmit']);
Route::get('forgot-password', [AccountController::class, 'forgotPassword']);
Route::get('reset-password', [AccountController::class, 'resetPassword'])->middleware('throttle:5,10');
Route::post('reset-password', [AccountController::class, 'resetPasswordSubmit'])->middleware('throttle:5,10');
Route::post('forgot-password', [AccountController::class, 'forgotPasswordSubmit'])->middleware('throttle:3,10');
Route::get('confirm-user-registration', [AccountController::class, 'confirmAccountCreation'])->middleware('throttle:10,10');
Route::post('confirm-user-registration', [AccountController::class, 'confirmAccountCreation'])->middleware('throttle:10,10');
Route::get('setUserTimezone', function () {
    Session::put('user_timezone', request('timezone'));
});
Route::get('allocation-request', [AccountController::class, 'allocationRequestView']);
Route::post('allocation-request', [AccountController::class, 'allocationRequestSubmit']);
Route::get('account/settings', [UserSettingsController::class, 'getUserSettings']);
Route::get('account/credential-store', [UserSettingsController::class, 'getCredentialStore']);
Route::post('account/set-default-credential', [UserSettingsController::class, 'setDefaultCredential']);
Route::post('account/add-credential', [UserSettingsController::class, 'addCredential']);
Route::post('account/delete-credential', [UserSettingsController::class, 'deleteCredential']);
Route::get('account/user-compute-resources', [UserSettingsController::class, 'getComputeResources']);
Route::post('account/add-user-crp', [UserSettingsController::class, 'addUserComputeResourcePreference']);
Route::post('account/update-user-crp', [UserSettingsController::class, 'updateUserComputeResourcePreference']);
Route::post('account/delete-user-crp', [UserSettingsController::class, 'deleteUserComputeResourcePreference']);
Route::get('account/user-storage-resources', [UserSettingsController::class, 'getStorageResources']);
Route::post('account/add-user-srp', [UserSettingsController::class, 'addUserStorageResourcePreference']);
Route::post('account/update-user-srp', [UserSettingsController::class, 'updateUserStorageResourcePreference']);
Route::post('account/delete-user-srp', [UserSettingsController::class, 'deleteUserStorageResourcePreference']);
Route::get('account/user-profile', [UserSettingsController::class, 'getUserProfile']);
Route::post('account/user-profile', [UserSettingsController::class, 'updateUserProfile']);
Route::get('account/user-profile-update-email', [UserSettingsController::class, 'showUpdateEmailView']);
Route::post('account/user-profile-update-email', [UserSettingsController::class, 'submitUpdateEmail']);
Route::get('user-profile-confirm-email', [UserSettingsController::class, 'confirmUpdateEmail'])->middleware('throttle:10,10');
Route::get('project/create', [ProjectController::class, 'createView']);
Route::post('project/create', [ProjectController::class, 'createSubmit']);
Route::get('project/summary', [ProjectController::class, 'summary']);
Route::get('project/edit', [ProjectController::class, 'editView']);
Route::post('project/edit', [ProjectController::class, 'editSubmit']);
Route::get('project/browse', [ProjectController::class, 'browseView']);
Route::post('project/browse', [ProjectController::class, 'browseView']);
Route::get('project/shared-users', [ProjectController::class, 'sharedUsers']);
Route::get('project/unshared-users', [ProjectController::class, 'unsharedUsers']);
Route::get('project/all-users', [ProjectController::class, 'allUsers']);
Route::get('experiment/create', [ExperimentController::class, 'createView']);
Route::post('experiment/create', [ExperimentController::class, 'createSubmit']);
Route::get('experiment/summary', [ExperimentController::class, 'summary']);
Route::post('experiment/summary', [ExperimentController::class, 'expChange']);
Route::post('experiment/clone', [ExperimentController::class, 'cloneExperiment']);
Route::get('experiment/edit', [ExperimentController::class, 'editView']);
Route::post('experiment/edit', [ExperimentController::class, 'editSubmit']);
Route::get('experiment/getQueueView', [ExperimentController::class, 'getQueueView']);
Route::get('experiment/browse', [ExperimentController::class, 'browseView']);
Route::post('experiment/browse', [ExperimentController::class, 'browseView']);
Route::get('experiment/shared-users', [ExperimentController::class, 'sharedUsers']);
Route::get('experiment/unshared-users', [ExperimentController::class, 'unsharedUsers']);
Route::post('experiment/update-sharing', [ExperimentController::class, 'updateSharing']);
Route::get('download', function(){
    if(request()->has('path') && (0 == strpos(request('path'), session('username'))
            || 0 == strpos(request('path'), '/' . session('username')))){
        $path = request('path');
        if (strpos($path, '/../') !== false || strpos($path, '/..') !== false || strpos($path, '../') !== false)
            return null;
        if(0 === strpos($path, '/')){
            $path = substr($path, 1);
        }
        $downloadLink = config('pga_config.airavata')['experiment-data-absolute-path'] . '/' . $path;
        return response()->download($downloadLink);
    }else if(request()->has('id') && (0 == strpos(request('id'), 'airavata-dp'))){
        $id = request('id');
        $dataRoot = config('pga_config.airavata')['experiment-data-absolute-path'];
        if(!((($temp = strlen($dataRoot) - strlen('/')) >= 0 && strpos($dataRoot, '/', $temp) !== false)))
            $dataRoot = $dataRoot . '/';
        $dataProductModel = \Airavata::getDataProduct(session('authz-token'), $id);
        $currentOutputPath = '';
        foreach ($dataProductModel->replicaLocations as $rp) {
            if($rp->replicaLocationCategory == \Airavata\Model\Data\Replica\ReplicaLocationCategory::GATEWAY_DATA_STORE){
                $currentOutputPath = $rp->filePath;
                break;
            }
        }
        //TODO check permission
        $path = str_replace($dataRoot, '', parse_url($currentOutputPath, PHP_URL_PATH));
        $downloadLink = parse_url(url('/') . config('pga_config.airavata')['experiment-data-absolute-path'] . '/' . $path, PHP_URL_PATH);
        return response()->download($downloadLink);
    }
});
Route::get('files/browse', [FilemanagerController::class, 'browse']);
Route::get('files/get', [FilemanagerController::class, 'get']);
Route::get('group/create', [GroupController::class, 'createView']);
Route::post('group/create', [GroupController::class, 'createSubmit']);
Route::get('group/view', [GroupController::class, 'viewView']);
Route::post('group/edit', [GroupController::class, 'editSubmit']);
Route::get('cr/create', function () {
    return redirect('cr/create/step1');
});
Route::get('cr/create', [ComputeResourceController::class, 'createView']);
Route::post('cr/create', [ComputeResourceController::class, 'createSubmit']);
Route::get('/', [HomeController::class, 'index']); 