<?php

namespace App\Http\Controllers\Admin;

use App\Models\Feedback;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreFeedbackRequest;
use App\Http\Requests\UpdateFeedbackRequest;

class AdminFeedbackController extends Controller {
    public function index() {
        //
    }

    public function create() {
        //
    }

    public function store(StoreFeedbackRequest $request) {
        //
    }

    public function show(Feedback $feedback) {
        //
    }

    public function edit(Feedback $feedback) {
        //
    }

    public function update(UpdateFeedbackRequest $request, Feedback $feedback) {
        //
    }

    public function destroy(Feedback $feedback) {
        //
    }
}